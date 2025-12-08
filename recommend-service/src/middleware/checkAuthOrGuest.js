// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const checkAuthOrGuest = (req, res, next) => {
  const tokenHeader = req.headers.authorization;

  // TRƯỜNG HỢP KHÁCH (GUEST): Không có token
  if (!tokenHeader) {
    req.user = null; // Đánh dấu là không có user
    return next();   // Cho phép đi tiếp vào Controller để lấy Random Jobs
  }

  // TRƯỜNG HỢP CÓ TOKEN: Kiểm tra token
  if (!tokenHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: "Định dạng Token không hợp lệ" });
  }
  
  const token = tokenHeader.split(" ")[1]; 

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Lưu thông tin user đã giải mã
    next();
  } catch (error) {
    // Nếu token sai/hết hạn, vẫn trả về 403 để client biết đường refresh token
    return res.status(403).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};