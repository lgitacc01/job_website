import axios from 'axios';

// 1. Tạo instance
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Lấy từ .env (http://localhost:3000)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor cho REQUEST (Gửi đi)
// Tự động gắn token vào header nếu có
axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Interceptor cho RESPONSE (Nhận về)
// Xử lý khi Token hết hạn (Lỗi 401)
axiosClient.interceptors.response.use(
  (response) => {
    return response; // Nếu ngon lành thì trả về data
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và request này chưa từng được thử lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu đã retry để tránh lặp vô hạn

      try {
        console.log("Token hết hạn, đang thử refresh...");
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) throw new Error("Không có refresh token");

        // Gọi API Refresh (LƯU Ý: Sửa đường dẫn này cho đúng với Backend của bạn)
        // Giả sử đường dẫn backend là /user/user/refresh-token
        const result = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/user/refresh-token`, {
            refreshToken: refreshToken
        });

        // Lấy token mới từ server trả về
        const { accessToken } = result.data; 

        // Lưu lại token mới
        localStorage.setItem('accessToken', accessToken);

        // Gắn token mới vào request bị lỗi lúc nãy
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Gọi lại request đó
        return axiosClient(originalRequest);

      } catch (refreshError) {
        // Nếu Refresh Token cũng lỗi -> Bắt đăng nhập lại
        console.log("Phiên đăng nhập hết hạn hoàn toàn.");
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;