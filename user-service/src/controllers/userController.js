import User from '../models/user.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export const createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
};

// --- HÀM LOGIN SỬA ĐỔI ---
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Tìm user trong DB
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: username + " không tồn tại!" });
    }

    // 2. So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không đúng!" });
    }

    // 3. Chuẩn bị dữ liệu để nén vào token
    const payload = {
      user_id: user.user_id,
      role_id: user.role_id,
      username: user.username
    };

    // --- THAY ĐỔI Ở ĐÂY: TẠO 2 TOKEN ---

    // Token 1: Access Token (Hết hạn sau 15 phút)
    const accessToken = jwt.sign(
      payload, 
      process.env.ACCESS_TOKEN_SECRET, // Khóa bí mật cho Access Token
      { expiresIn: '15m' }        // Thời gian: 15 minutes
    );

    // Token 2: Refresh Token (Hết hạn sau 7 ngày)
    const refreshToken = jwt.sign(
      payload, 
      process.env.REFRESH_TOKEN_SECRET, // Khóa bí mật cho Refresh Token (Nên khác key trên)
      { expiresIn: '7d' }          // Thời gian: 7 days
    );

    // 4. Ẩn mật khẩu user
    const { password: pass, ...userInfo } = user.toObject(); 

    // 5. Trả về cả 2 token
    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      user: {
        role_id: user.role_id,
        username: user.username,
        user_id: user.user_id
      },
      accessToken: accessToken,   // Token ngắn hạn
      refreshToken: refreshToken  // Token dài hạn
    });

  } catch (error) {
    console.error("Lỗi Login:", error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

export const refreshToken = async (req, res) => {
    // 1. Lấy Refresh Token từ body của request
    const { refreshToken } = req.body;

    // Kiểm tra xem Refresh Token có tồn tại không
    if (!refreshToken) {
        // 
        return res.status(401).json({ 
            success: false, 
            message: "Không tìm thấy Refresh Token. Vui lòng đăng nhập lại." 
        });
    }

    try {
        // 2. Xác thực Refresh Token
        // Sử dụng khóa bí mật của Refresh Token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Dữ liệu đã được giải mã: decoded.user_id, decoded.role_id, decoded.username
        
        // ** (Tùy chọn) 3. Kiểm tra user trong DB (để đảm bảo user chưa bị xóa hoặc thay đổi)**
        // const user = await User.findOne({ user_id: decoded.user_id });
        // if (!user) {
        //     return res.status(403).json({ success: false, message: "User không tồn tại." });
        // }

        // 4. Chuẩn bị payload để tạo Access Token MỚI
        const payload = {
            user_id: decoded.user_id,
            role_id: decoded.role_id,
            username: decoded.username
        };

        // 5. Tạo Access Token MỚI (Vẫn giữ thời gian hết hạn ngắn, ví dụ 15 phút)
        const newAccessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' } // 15 minutes
        );

        // 6. Trả về Access Token mới cho client
        res.status(200).json({
            success: true,
            message: "Access Token đã được làm mới thành công.",
            accessToken: newAccessToken
        });

    } catch (error) {
        // Nếu xác thực thất bại (ví dụ: token hết hạn, sai chữ ký,...)
        console.error("Lỗi Refresh Token:", error.message);
        return res.status(403).json({ 
            success: false, 
            message: "Refresh Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại." 
        });
    }
};