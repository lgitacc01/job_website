import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import Job from "./src/models/job.js"; // ⚠️ LƯU Ý: Kiểm tra lại đường dẫn tới file model Job của bạn cho đúng nhé

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const dbUrl = process.env.MONGO_URI || process.env.DB_URL;

if (!dbUrl) {
  console.error("❌ Lỗi: Không tìm thấy biến kết nối DB trong file .env");
  process.exit(1);
}

const seedJobs = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("✅ Đã kết nối MongoDB");

    // Dữ liệu 10 công việc (3 IT + 7 Ngành khác)
    const rawJobs = [
      // --- 3 CÔNG VIỆC IT ---
      {
        job_id: 1,
        job_title: "Senior Backend Developer (Node.js)",
        closed_date: new Date("2024-12-30"),
        salary: 45000000,
        area: "TP. Hồ Chí Minh",
        experience: "3-5 năm",
        degree: "Đại học",
        post_user_id: 101,
        description: "Phát triển và duy trì các dịch vụ backend sử dụng Node.js và MongoDB. Tối ưu hóa hiệu suất hệ thống.",
        requirements: "Thành thạo JavaScript/TypeScript, Node.js. Có kinh nghiệm với Microservices.",
        benefits: "Lương tháng 13, Bảo hiểm full lương, Review lương 2 lần/năm, Macbook Pro."
      },
      {
        job_id: 2,
        job_title: "Frontend Developer (ReactJS)",
        closed_date: new Date("2024-11-20"),
        salary: 25000000,
        area: "Hà Nội",
        experience: "1-2 năm",
        degree: "Cao đẳng/Đại học",
        post_user_id: 102,
        description: "Xây dựng giao diện người dùng website e-commerce. Phối hợp với team Backend.",
        requirements: "Có kiến thức vững về HTML, CSS, JavaScript. Thành thạo ReactJS, Redux.",
        benefits: "Thưởng dự án, Team building hàng quý, Môi trường làm việc trẻ trung."
      },
      {
        job_id: 3,
        job_title: "Automation Tester (Selenium/Java)",
        closed_date: new Date("2024-12-15"),
        salary: 30000000,
        area: "Đà Nẵng",
        experience: "Trên 2 năm",
        degree: "Đại học",
        post_user_id: 101,
        description: "Viết kịch bản kiểm thử tự động cho ứng dụng web. Báo cáo lỗi và phối hợp với Dev.",
        requirements: "Có kinh nghiệm viết script bằng Java/Python. Hiểu biết về quy trình Scrum/Agile.",
        benefits: "Trợ cấp ngoại ngữ, Bảo hiểm sức khỏe PVI, Làm việc Remote 2 ngày/tuần."
      },

      // --- 7 CÔNG VIỆC CÁC LĨNH VỰC KHÁC ---
      {
        job_id: 4,
        job_title: "Nhân viên Kinh doanh Bất động sản",
        closed_date: new Date("2025-01-10"),
        salary: 10000000,
        area: "TP. Hồ Chí Minh",
        experience: "Không yêu cầu",
        degree: "Trung cấp",
        post_user_id: 205,
        description: "Tìm kiếm khách hàng, tư vấn các dự án căn hộ chung cư.",
        requirements: "Giao tiếp tốt, nhanh nhẹn, chịu được áp lực doanh số.",
        benefits: "Hoa hồng cao (2-3%), Thưởng nóng theo giao dịch."
      },
      {
        job_id: 5,
        job_title: "Kế toán Tổng hợp",
        closed_date: new Date("2024-11-30"),
        salary: 15000000,
        area: "Bình Dương",
        experience: "3 năm",
        degree: "Đại học",
        post_user_id: 301,
        description: "Thực hiện hạch toán các nghiệp vụ kế toán, lập báo cáo tài chính.",
        requirements: "Tốt nghiệp chuyên ngành Tài chính - Kế toán. Thành thạo MISA.",
        benefits: "Lương tháng 13, Du lịch hàng năm, Phụ cấp ăn trưa."
      },
      {
        job_id: 6,
        job_title: "Content Marketing Specialist",
        closed_date: new Date("2024-12-05"),
        salary: 12000000,
        area: "Hà Nội",
        experience: "1 năm",
        degree: "Cao đẳng",
        post_user_id: 404,
        description: "Sáng tạo nội dung cho Fanpage, Website. Lên ý tưởng kịch bản TikTok.",
        requirements: "Viết lách tốt, sáng tạo. Biết thiết kế cơ bản là lợi thế.",
        benefits: "Môi trường năng động, Thưởng KPI."
      },
      {
        job_id: 7,
        job_title: "Chuyên viên Tuyển dụng (HR)",
        closed_date: new Date("2024-12-25"),
        salary: 14000000,
        area: "TP. Hồ Chí Minh",
        experience: "2 năm",
        degree: "Đại học",
        post_user_id: 502,
        description: "Đăng tin tuyển dụng, sàng lọc hồ sơ, phỏng vấn ứng viên.",
        requirements: "Kỹ năng giao tiếp và nhìn nhận con người tốt.",
        benefits: "Thưởng tuyển dụng, Chế độ công đoàn đầy đủ."
      },
      {
        job_id: 8,
        job_title: "Kỹ sư Xây dựng dân dụng",
        closed_date: new Date("2025-02-01"),
        salary: 20000000,
        area: "Đồng Nai",
        experience: "3-5 năm",
        degree: "Đại học",
        post_user_id: 601,
        description: "Giám sát thi công tại công trường, bóc tách khối lượng.",
        requirements: "Chịu được áp lực đi công trình. Sử dụng thành thạo AutoCAD.",
        benefits: "Phụ cấp đi lại, Phụ cấp công trình."
      },
      {
        job_id: 9,
        job_title: "Nhân viên Chăm sóc Khách hàng",
        closed_date: new Date("2024-11-25"),
        salary: 8000000,
        area: "Cần Thơ",
        experience: "Dưới 1 năm",
        degree: "Trung cấp",
        post_user_id: 703,
        description: "Trực tổng đài, giải đáp thắc mắc của khách hàng.",
        requirements: "Giọng nói dễ nghe, kiên nhẫn, hòa nhã.",
        benefits: "Làm việc theo ca linh hoạt, Thưởng chuyên cần."
      },
      {
        job_id: 10,
        job_title: "Phiên dịch viên tiếng Nhật (N2)",
        closed_date: new Date("2024-12-10"),
        salary: 22000000,
        area: "Hải Phòng",
        experience: "Không yêu cầu",
        degree: "Đại học",
        post_user_id: 808,
        description: "Phiên dịch trong các cuộc họp, dịch tài liệu kỹ thuật.",
        requirements: "Tiếng Nhật N2 trở lên. Ưu tiên biết thêm tiếng Anh.",
        benefits: "Xe đưa đón, Trợ cấp tiếng Nhật, Đào tạo tại Nhật Bản."
      }
    ];

    console.log(`⏳ Đang xử lý import ${rawJobs.length} công việc...`);

    // Duyệt qua từng job để upsert (chèn hoặc cập nhật)
    for (const job of rawJobs) {
      await Job.findOneAndUpdate(
        { job_id: job.job_id }, // Tìm theo job_id
        job,                    // Dữ liệu update
        { upsert: true, new: true } // Nếu chưa có thì tạo mới
      );
      console.log(`-> Đã xong job: ${job.job_title}`);
    }

    console.log("✅ Đã tạo dữ liệu Job thành công!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Lỗi:", error);
    mongoose.connection.close();
  }
};

seedJobs();