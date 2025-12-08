import Job from "../models/job.js";
import { publishSearchEvent } from '../config/rabbitconfig.js';

export const getAllJobs = async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
};

export const createJob = async (req, res) => {
  const job = await Job.create(req.body);
  res.json(job);
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
export const getRandomJobs = async (req, res) => {
  try {
    // Sử dụng $sample để lấy ngẫu nhiên 5 document
    const jobs = await Job.aggregate([
      { $sample: { size: 5 } } 
    ]);

    res.status(200).json({
      count: jobs.length,
      data: jobs
    });

  } catch (error) {
    console.error("Lỗi Get Random Jobs:", error);
    res.status(500).json({ message: "Lỗi Server", error: error.message });
  }
};