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
    // 1. Lấy thông tin User
    const userId = req.user ? req.user.user_id : null; 
    console.log("UserId từ token:", userId);
    
    // 2. Lấy Token gốc từ request của người dùng gửi lên
    // (Để tí nữa mình gửi kèm sang Job Service)
    const token = req.headers.authorization; 

    let keywordToSearch = null;

    // --- LOGIC 1: CHECK LỊCH SỬ ---
    if (userId) {
      const userHistory = await Recommend.findOne({ userId });
      if (userHistory && userHistory.last_search) {
        keywordToSearch = userHistory.last_search;
        console.log(`Lịch sử tìm kiếm của User ${userId}:`, keywordToSearch);
      }
    }

    // --- LOGIC 2: GỌI JOB SERVICE ---
    let jobsData;

    if (keywordToSearch) {
      console.log(`User ${userId}: Tìm kiếm jobs với từ khóa "${keywordToSearch}"`);
      
      // === SỬA Ở ĐÂY: THÊM HEADERS ===
      // Phải gửi kèm token sang Job Service để nó biết đây là user nào
      const response = await axios.get(`${JOB_SERVICE_URL}/search`, {
        params: { q: keywordToSearch },
        headers: { Authorization: token } // <--- QUAN TRỌNG NHẤT
      });
      
      jobsData = response.data;

    } else {
      console.log(userId ? `User ${userId}: Chưa có lịch sử -> Random` : "Guest: Random jobs");
      
      // Với API Random, tùy vào logic bên Job Service:
      // - Nếu bên Job Service api /random là Public: Không cần gửi token cũng được.
      // - Nếu bên Job Service api /random bắt buộc login: Thì phải gửi token.
      // Để an toàn, nếu có token thì cứ gửi đi.
      
      const config = {};
      if (token) {
          config.headers = { Authorization: token };
      }

      const response = await axios.get(`${JOB_SERVICE_URL}/random`, config);
      jobsData = response.data;
    }

    return res.status(200).json(jobsData);

  } catch (error) {
    console.error("Lỗi API Recommend:", error.message);

    // Xử lý lỗi 401 từ Job Service trả về
    if (error.response && error.response.status === 401) {
        return res.status(401).json({ message: "Job Service từ chối truy cập (Token không hợp lệ hoặc hết hạn)." });
    }

    if (error.code === 'ECONNREFUSED') {
       return res.status(500).json({ message: "Không kết nối được tới Job Service (Check URL/Docker)." });
    }
    
    return res.status(500).json({ message: "Lỗi nội bộ server." });
  }
};