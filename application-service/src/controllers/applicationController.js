import Application from "../models/application.js";
import axios from "axios";

const JOB_SERVICE_URL="http://job-service:3002/job";

export const getAllApplications = async (req, res) => {
  const apps = await Application.find();
  res.json(apps);
};

export const createApplication = async (req, res) => {
  const app = await Application.create(req.body);
  res.json(app);
};

export const applyJob = async (req, res) => {
  try {
    const user_id = req.user?.user_id;

    if (!user_id) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }

    const { job_id } = req.body;

    if (!job_id) {
      return res.status(400).json({ message: "Thiếu job_id" });
    }

    // ⚠️ Kiểm tra user đã apply job này chưa
    const existed = await Application.findOne({ user_id, job_id });

    if (existed) {
      return res.status(400).json({
        message: "Bạn đã apply job này rồi"
      });
    }

    // Tạo application_id đơn giản
    const application_id = Date.now();

    // Lưu record mới
    const application = new Application({
      application_id,
      user_id,
      job_id
    });

    await application.save();

    res.status(201).json({
      message: "Ứng tuyển thành công",
      data: application
    });

  } catch (error) {
    console.error("Apply Job Error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const getJobApply = async (req, res) => {
  try {
    // 1. Lấy user_id từ token
    const user_id = req.user?.user_id;
    if (!user_id) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }

    // 2. Lấy token gốc để gửi kèm sang Job Service
    const token = req.headers.authorization;

    // 3. Tìm toàn bộ job_id user đã apply
    const applications = await Application.find({ user_id });
    console.log("Applications found:", applications);

    if (applications.length === 0) {
      return res.status(200).json({
        message: "User chưa apply job nào",
        data: []
      });
    }

    const jobIds = applications.map(a => a.job_id);

    // 4. Gửi lần lượt từng job_id sang Job Service
    const jobDetails = [];

    for (const id of jobIds) {
      try {
        const response = await axios.get(`${JOB_SERVICE_URL}/${id}`, {
          headers: { Authorization: token }
        });

        jobDetails.push(response.data);
      } catch (err) {
        console.log(`⚠️ Không lấy được job ${id}:`, err.message);
      }
    }

    return res.status(200).json({
      count: jobDetails.length,
      data: jobDetails
    });

  } catch (error) {
    console.error("Get Job Apply Error:", error.message);
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};