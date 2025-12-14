import Recommend from "../models/recommend.js";
import axios from "axios";
const JOB_SERVICE_URL = "http://job-service:3002/job"

export const getAllRecommends = async (req, res) => {
  const recs = await Recommend.find();
  res.json(recs);
};

export const createRecommend = async (req, res) => {
  const rec = await Recommend.create(req.body);
  res.json(rec);
};



export const getJobRecommendations = async (req, res) => {
  try {
    const userId = req.user ? req.user.user_id : null;
    console.log("UserId từ token:", userId);

    const token = req.headers.authorization;

    // 🔥 LẤY PAGE TỪ CLIENT
    const page = parseInt(req.query.page, 10) || 1;

    let keywordToSearch = null;

    // --- LOGIC 1: CHECK LỊCH SỬ ---
    if (userId) {
      const userHistory = await Recommend.findOne({ userId });
      if (userHistory && userHistory.last_search) {
        keywordToSearch = userHistory.last_search;
      }
    }

    let jobsData;

    // --- LOGIC 2: GỌI JOB SERVICE ---
    if (keywordToSearch) {
      const response = await axios.get(
        `${JOB_SERVICE_URL}/search`,
        {
          params: { q: keywordToSearch, page }, // 👈 truyền page nếu search có pagination
          headers: { Authorization: token }
        }
      );

      jobsData = response.data;

    } else {
      const config = {
        params: { page }, // 👈🔥 TRUYỀN PAGE QUA JOB SERVICE
      };

      if (token) {
        config.headers = { Authorization: token };
      }

      const response = await axios.get(
        `${JOB_SERVICE_URL}/pagination`,
        config
      );

      jobsData = response.data;
    }

    return res.status(200).json(jobsData);

  } catch (error) {
    console.error("Lỗi API Recommend:", error.message);

    if (error.response && error.response.status === 401) {
      return res.status(401).json({
        message: "Job Service từ chối truy cập (Token không hợp lệ hoặc hết hạn)."
      });
    }

    if (error.code === "ECONNREFUSED") {
      return res.status(500).json({
        message: "Không kết nối được tới Job Service (Check URL/Docker)."
      });
    }

    return res.status(500).json({ message: "Lỗi nội bộ server." });
  }
};
