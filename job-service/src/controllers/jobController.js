import Job from "../models/job.js";
import { publishSearchEvent } from '../config/rabbitconfig.js';

export const getAllJobs = async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
};

export const createJob = async (req, res) => {
  try {
    // Determine the next job_id by inspecting the current max
    const last = await Job.findOne().sort({ job_id: -1 }).select('job_id');
    const nextId = last && last.job_id ? last.job_id + 1 : 1;

    const payload = { ...req.body, job_id: nextId };

    const job = await Job.create(payload);
    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Failed to create job', error: error.message });
  }
};

export const searchJobs = async (req, res) => {
  try {
    // Lấy từ khóa từ query params
    const { q } = req.query; 

    if (!q) {
      return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
    }

    // ============================================================
    // 🔴 ĐOẠN CODE MỚI: Gửi sự kiện Search sang RabbitMQ
    // ============================================================
    
    // Lưu ý: req.user thường có được nhờ Middleware xác thực (JWT/Session)
    // Nếu user chưa đăng nhập (khách vãng lai), userId có thể là null
    const userId = req.user ? req.user.user_id : null; 

    if (userId) {
        // Gọi hàm producer để đẩy tin nhắn vào hàng đợi
        // Dùng await để đảm bảo tin nhắn được gửi (do producer của bạn có logic đóng connection)
        await publishSearchEvent(userId, q);
    } else {
        console.log("⚠️ Guest search - Không gửi event rabbitmq (không có userId)");
    }
    // ============================================================


    // --- Logic tìm kiếm cũ vẫn giữ nguyên ---

    // 2. Tách chuỗi tìm kiếm
    const keywords = q.split(/\s+/);

    // 3. Tạo điều kiện Regex
    const searchConditions = keywords.map(word => ({
      job_title: { $regex: word, $options: 'i' }
    }));

    // 4. Query Database
    const jobs = await Job.find({
      $or: searchConditions
    });

    res.json({
      count: jobs.length,
      data: jobs
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi Server", error: error.message });
  }
};
// Ví dụ: import Job model (tùy thuộc vào cấu trúc dự án của bạn)
// import Job from '../models/Job.js'; 

// --- PHẦN LOGIC QUẢN LÝ TRẠNG THÁI ---

// Khai báo một mảng để lưu trữ các Job ID đã được lấy ngẫu nhiên.
// Biến này sẽ giữ trạng thái giữa các request.
let fetchedJobIds = [];

// Số lượng ID tối đa trước khi reset danh sách (ví dụ: 10)
const MAX_FETCHED_IDS = 10;

// --- PHẦN CONTROLLERS ---

/**
 * @route GET /api/jobs/random
 * @desc Lấy ngẫu nhiên 5 Job, loại trừ các Job đã được lấy gần đây.
 * @access Public
 */
export const getRandomJobs = async (req, res) => {
  try {
    
    // 1. Kiểm tra và Reset danh sách ID đã lấy
    if (fetchedJobIds.length >= MAX_FETCHED_IDS) {
      console.log("Danh sách fetchedJobIds đã đạt giới hạn. Resetting...");
      fetchedJobIds = []; // Xóa hết các ID đã lưu
    }
    
    // 2. Định nghĩa điều kiện tìm kiếm: Loại trừ các Job có ID nằm trong fetchedJobIds
    // Sử dụng _id của MongoDB (thường là ObjectId)
    const matchCondition = fetchedJobIds.length > 0
      ? { '_id': { $nin: fetchedJobIds } } // Loại trừ các ID đã lưu
      : {}; // Nếu chưa có ID nào, không có điều kiện loại trừ

    let jobs = [];
    
    // 3. Sử dụng Aggregate: Match (loại trừ) trước, sau đó Sample (lấy ngẫu nhiên)
    jobs = await Job.aggregate([
      { $match: matchCondition }, // Lọc bỏ các Job đã lấy
      { $sample: { size: 5 } } // Lấy ngẫu nhiên 5 Job còn lại
    ]);

    // 4. Xử lý trường hợp không đủ Jobs sau khi lọc
    // Nếu số lượng Job lấy được ít hơn 5 VÀ ta đã có danh sách lọc
    if (jobs.length < 5 && fetchedJobIds.length > 0) {
        console.log(`Chỉ lấy được ${jobs.length} Jobs sau khi lọc. Reset fetchedJobIds và thử lại.`);
        
        fetchedJobIds = []; // Reset để có thể lấy lại
        
        // Thử lại lần 2 (lấy ngẫu nhiên 5 Job từ tất cả các Job)
        jobs = await Job.aggregate([
            { $sample: { size: 5 } } 
        ]);
    }

    // 5. Lưu các ID của các Job vừa lấy vào mảng fetchedJobIds
    const newIds = jobs.map(job => job.id);
    
    // Thêm các ID mới, đảm bảo tổng số không vượt quá giới hạn
    newIds.forEach(id => {
        // Chỉ thêm nếu tổng số ID hiện tại nhỏ hơn giới hạn
        if (fetchedJobIds.length < MAX_FETCHED_IDS) {
            fetchedJobIds.push(id);
        }
    });

    // 6. Trả về kết quả
    res.status(200).json({
      count: jobs.length,
      data: jobs
    });

  } catch (error) {
    console.error("Lỗi Get Random Jobs:", error);
    res.status(500).json({ message: "Lỗi Server", error: error.message });
  }
};


/**
 * @route GET /api/jobs/:id
 * @desc Lấy Job theo ID
 * @access Public
 */

export const getJobById = async (req, res) => {
  try {
    // 1. Lấy Job ID từ request parameters (ví dụ: /api/jobs/65615d18d0f...)
    const jobId = req.params.id;

    // 2. Kiểm tra tính hợp lệ của ID (tùy chọn nhưng nên có)
    // if (!mongoose.Types.ObjectId.isValid(jobId)) { 
    //   return res.status(400).json({ message: "Job ID không hợp lệ" });
    // }

    // 3. Tìm kiếm Job trong database bằng ID
    const job = await Job.findOne({ job_id: jobId });

    // 4. Xử lý trường hợp không tìm thấy Job
    if (!job) {
      return res.status(404).json({ message: "Không tìm thấy công việc (Job) này" });
    }

    // 5. Trả về Job tìm được
    res.status(200).json(job);

  } catch (error) {
    console.error(`Lỗi Get Job by ID (${req.params.id}):`, error);
    // Xử lý các lỗi liên quan đến DB hoặc Server
    res.status(500).json({ message: "Lỗi Server khi tìm kiếm Job", error: error.message });
  }
};

export const getJobsPagination = async (req, res) => {
  try {
  const DEFAULT_LIMIT = 6;

    const pageQuery = req.query.page;
    const limitQuery = req.query.limit;

    let page = 1;
    if (pageQuery) {
      const parsedPage = parseInt(pageQuery, 10);
      if (!isNaN(parsedPage) && parsedPage > 0) {
        page = parsedPage;
      }
    }

    let limit = DEFAULT_LIMIT;
    if (limitQuery) {
      const parsedLimit = parseInt(limitQuery, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        limit = parsedLimit;
      }
    }

    // 🔥 Tổng số job
    const totalJobs = await Job.countDocuments({});
    const totalPages = Math.ceil(totalJobs / limit) || 1;

    // Use stable skip/limit pagination so pages don't shift when new jobs are added
    const skip = (page - 1) * limit;

    const jobs = await Job.find({})
      .sort({ job_id: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    // If requesting a page beyond available pages, return empty data with metadata
    if (jobs.length === 0 && page > totalPages) {
      return res.status(200).json({
        currentPage: page,
        totalPages,
        totalJobs,
        count: 0,
        data: [],
        message: "Đã hết Job trong database."
      });
    }

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalJobs,
      count: jobs.length,
      startJobId: jobs.length > 0 ? jobs[jobs.length - 1].job_id : null,
      endJobId: jobs.length > 0 ? jobs[0].job_id : null,
      data: jobs
    });

  } catch (error) {
    console.error("Lỗi Get Jobs Pagination:", error);
    res.status(500).json({
      message: "Lỗi Server",
      error: error.message
    });
  }
};
