import Job from "../models/job.js";

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
    // Lấy từ khóa từ query params (ví dụ: GET /jobs/search?q=it backend)
    const { q } = req.query; 

    if (!q) {
      return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
    }

    // 1. Tách chuỗi tìm kiếm thành các từ riêng biệt bằng khoảng trắng
    // Ví dụ: "it backend developer" -> ["it", "backend", "developer"]
    const keywords = q.split(/\s+/);

    // 2. Tạo danh sách các điều kiện Regex cho từng từ khóa
    // $regex: từ_khóa, $options: 'i' (không phân biệt hoa thường)
    const searchConditions = keywords.map(word => ({
      job_title: { $regex: word, $options: 'i' }
    }));

    // 3. Query database dùng toán tử $or
    // Nghĩa là: Tìm job có title chứa "it" HOẶC chứa "backend" HOẶC chứa "developer"
    const jobs = await Job.find({
      $or: searchConditions
    });

    res.json({
      count: jobs.length,
      data: jobs
    });

  } catch (error) {
    res.status(500).json({ message: "Lỗi Server", error: error.message });
  }
};