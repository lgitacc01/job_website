import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import Job from "./src/models/job.js"; // ⚠️ Đảm bảo đường dẫn này chính xác

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
    console.log("---------------------------------------------");

    // ==============================================
    // 💥 BƯỚC 1: XÓA TẤT CẢ DỮ LIỆU CŨ TRONG COLLECTION 'job'
    // ==============================================
    console.log("⏳ Đang xóa toàn bộ dữ liệu Job cũ...");
    const deleteResult = await Job.deleteMany({});
    console.log(`✅ Đã xóa thành công ${deleteResult.deletedCount} bản ghi cũ.`);
    console.log("---------------------------------------------");


    // Dữ liệu 30 công việc đã được chuẩn hóa theo Schema (có company_name và salary: String)
    const rawJobs = [
      // Bỏ dữ liệu mẫu vào đây (như trong phản hồi trước)
      {
        job_id: 1,
        job_title: "Senior Backend Developer (Node.js)",
        company_name: "Tech Solutions Corp.",
        closed_date: new Date("2024-12-30"),
        salary: "35,000,000 - 45,000,000 VND",
        area: "TP. Hồ Chí Minh",
        experience: "3-5 năm",
        degree: "Đại học",
        post_user_id: 101,
        description: "Phát triển và duy trì các dịch vụ backend...",
        requirements: "Thành thạo JavaScript/TypeScript, Node.js...",
        benefits: "Lương tháng 13, Bảo hiểm full lương, Macbook Pro."
      },
      {
        job_id: 2,
        job_title: "Frontend Developer (ReactJS)",
        company_name: "E-Commerce Growth",
        closed_date: new Date("2024-11-20"),
        salary: "20,000,000 - 30,000,000 VND",
        area: "Hà Nội",
        experience: "1-2 năm",
        degree: "Cao đẳng/Đại học",
        post_user_id: 102,
        description: "Xây dựng giao diện người dùng website e-commerce...",
        requirements: "Thành thạo ReactJS, Redux...",
        benefits: "Thưởng dự án, Team building hàng quý..."
      },
      {
        job_id: 3,
        job_title: "Automation Tester (Selenium/Java)",
        company_name: "Quality Assurance Ltd.",
        closed_date: new Date("2024-12-15"),
        salary: "25,000,000 - 35,000,000 VND",
        area: "Đà Nẵng",
        experience: "Trên 2 năm",
        degree: "Đại học",
        post_user_id: 101,
        description: "Viết kịch bản kiểm thử tự động...",
        requirements: "Có kinh nghiệm viết script bằng Java/Python...",
        benefits: "Trợ cấp ngoại ngữ, Bảo hiểm sức khỏe PVI..."
      },
      {
        job_id: 4,
        job_title: "Nhân viên Kinh doanh Bất động sản",
        company_name: "Landmark Real Estate",
        closed_date: new Date("2025-01-10"),
        salary: "10,000,000 VND + Hoa Hồng",
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
        company_name: "Finance Pro Services",
        closed_date: new Date("2024-11-30"),
        salary: "14,000,000 - 18,000,000 VND",
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
        company_name: "Creative Digital Agency",
        closed_date: new Date("2024-12-05"),
        salary: "12,000,000 - 16,000,000 VND",
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
        company_name: "Talent Hub Vietnam",
        closed_date: new Date("2024-12-25"),
        salary: "14,000,000 - 17,000,000 VND",
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
        company_name: "VietBuild Group",
        closed_date: new Date("2025-02-01"),
        salary: "18,000,000 - 25,000,000 VND",
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
        company_name: "Customer Connect",
        closed_date: new Date("2024-11-25"),
        salary: "7,000,000 - 9,000,000 VND",
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
        company_name: "Japan Tech Hub",
        closed_date: new Date("2024-12-10"),
        salary: "20,000,000 - 25,000,000 VND",
        area: "Hải Phòng",
        experience: "Không yêu cầu",
        degree: "Đại học",
        post_user_id: 808,
        description: "Phiên dịch trong các cuộc họp, dịch tài liệu kỹ thuật.",
        requirements: "Tiếng Nhật N2 trở lên. Ưu tiên biết thêm tiếng Anh.",
        benefits: "Xe đưa đón, Trợ cấp tiếng Nhật, Đào tạo tại Nhật Bản."
      },
      // ====== JOB 11 → 20 (IT / DEV) ======
      {
        job_id: 11,
        job_title: "Junior Backend Developer (Node.js)",
        company_name: "Startup Code",
        closed_date: new Date("2025-01-15"),
        salary: "15,000,000 - 20,000,000 VND",
        area: "Hà Nội",
        experience: "Dưới 1 năm",
        degree: "Đại học",
        post_user_id: 901,
        description: "Phát triển API backend với Node.js, Express, MongoDB.",
        requirements: "Biết JavaScript, REST API, MongoDB.",
        benefits: "Đào tạo bài bản, lộ trình thăng tiến rõ ràng."
      },
      {
        job_id: 12,
        job_title: "Fullstack Developer (React + Node)",
        company_name: "Mega Software",
        closed_date: new Date("2025-01-20"),
        salary: "30,000,000 - 40,000,000 VND",
        area: "TP. Hồ Chí Minh",
        experience: "2-4 năm",
        degree: "Đại học",
        post_user_id: 902,
        description: "Xây dựng hệ thống web end-to-end.",
        requirements: "ReactJS, Node.js, REST API.",
        benefits: "Remote 2 ngày/tuần, thưởng hiệu suất."
      },
      {
        job_id: 13,
        job_title: "Mobile Developer (React Native)",
        company_name: "App Innovator",
        closed_date: new Date("2025-02-01"),
        salary: "25,000,000 - 35,000,000 VND",
        area: "Đà Nẵng",
        experience: "1-3 năm",
        degree: "Cao đẳng/Đại học",
        post_user_id: 903,
        description: "Phát triển ứng dụng mobile đa nền tảng.",
        requirements: "React Native, Redux.",
        benefits: "Thiết bị Macbook, môi trường trẻ."
      },
      {
        job_id: 14,
        job_title: "DevOps Engineer (AWS)",
        company_name: "Cloud Solutions",
        closed_date: new Date("2025-02-10"),
        salary: "40,000,000 - 55,000,000 VND",
        area: "Hà Nội",
        experience: "3-5 năm",
        degree: "Đại học",
        post_user_id: 904,
        description: "Triển khai CI/CD, quản lý server AWS.",
        requirements: "Docker, Kubernetes, AWS.",
        benefits: "Thưởng dự án, bảo hiểm cao cấp."
      },
      {
        job_id: 15,
        job_title: "QA Manual Tester",
        company_name: "Test Masters",
        closed_date: new Date("2025-01-05"),
        salary: "12,000,000 - 18,000,000 VND",
        area: "Cần Thơ",
        experience: "1 năm",
        degree: "Cao đẳng",
        post_user_id: 905,
        description: "Test phần mềm web và mobile.",
        requirements: "Biết viết test case.",
        benefits: "Thưởng theo dự án."
      },
      {
        job_id: 16,
        job_title: "Data Analyst",
        company_name: "Data Driven Co.",
        closed_date: new Date("2025-02-15"),
        salary: "30,000,000 - 40,000,000 VND",
        area: "TP. Hồ Chí Minh",
        experience: "2-3 năm",
        degree: "Đại học",
        post_user_id: 906,
        description: "Phân tích dữ liệu kinh doanh.",
        requirements: "SQL, Power BI, Python.",
        benefits: "Thưởng KPI, đào tạo nâng cao."
      },
      {
        job_id: 17,
        job_title: "Software Engineer (Java)",
        company_name: "Enterprise Systems",
        closed_date: new Date("2025-01-25"),
        salary: "25,000,000 - 35,000,000 VND",
        area: "Bắc Ninh",
        experience: "2 năm",
        degree: "Đại học",
        post_user_id: 907,
        description: "Phát triển hệ thống backend Java.",
        requirements: "Java, Spring Boot.",
        benefits: "Xe đưa đón, phụ cấp ăn trưa."
      },
      {
        job_id: 18,
        job_title: "IT Support",
        company_name: "Service Desk",
        closed_date: new Date("2025-01-18"),
        salary: "10,000,000 - 15,000,000 VND",
        area: "Huế",
        experience: "Không yêu cầu",
        degree: "Cao đẳng",
        post_user_id: 908,
        description: "Hỗ trợ kỹ thuật cho nhân viên.",
        requirements: "Biết phần cứng, mạng cơ bản.",
        benefits: "Giờ hành chính."
      },
      {
        job_id: 19,
        job_title: "Game Developer (Unity)",
        company_name: "Gaming Studio VN",
        closed_date: new Date("2025-02-20"),
        salary: "24,000,000 - 32,000,000 VND",
        area: "TP. Hồ Chí Minh",
        experience: "1-2 năm",
        degree: "Đại học",
        post_user_id: 909,
        description: "Phát triển game mobile với Unity.",
        requirements: "C#, Unity.",
        benefits: "Thưởng sản phẩm."
      },
      {
        job_id: 20,
        job_title: "AI Engineer",
        company_name: "Innovation Labs",
        closed_date: new Date("2025-03-01"),
        salary: "45,000,000 - 60,000,000 VND",
        area: "Hà Nội",
        experience: "3-5 năm",
        degree: "Đại học",
        post_user_id: 910,
        description: "Xây dựng mô hình AI/ML.",
        requirements: "Python, TensorFlow, PyTorch.",
        benefits: "Lương cao, nghiên cứu chuyên sâu."
      },

      // ====== JOB 21 → 30 (NGÀNH KHÁC) ======
      {
        job_id: 21,
        job_title: "Nhân viên Bán hàng",
        company_name: "Retail Pro",
        closed_date: new Date("2025-01-12"),
        salary: "9,000,000 VND + Hoa Hồng",
        area: "Quảng Ninh",
        experience: "Không yêu cầu",
        degree: "Trung cấp",
        post_user_id: 911,
        description: "Bán hàng tại cửa hàng.",
        requirements: "Giao tiếp tốt.",
        benefits: "Hoa hồng doanh số."
      },
      {
        job_id: 22,
        job_title: "Marketing Executive",
        company_name: "Media Solutions",
        closed_date: new Date("2025-01-30"),
        salary: "15,000,000 - 20,000,000 VND",
        area: "Đà Nẵng",
        experience: "1-2 năm",
        degree: "Đại học",
        post_user_id: 912,
        description: "Triển khai chiến dịch marketing.",
        requirements: "Digital Marketing.",
        benefits: "Thưởng chiến dịch."
      },
      {
        job_id: 23,
        job_title: "Nhân viên Kho",
        company_name: "Logistics Fast",
        closed_date: new Date("2025-01-22"),
        salary: "8,000,000 - 10,000,000 VND",
        area: "Bình Dương",
        experience: "Không yêu cầu",
        degree: "Trung cấp",
        post_user_id: 913,
        description: "Quản lý xuất nhập kho.",
        requirements: "Cẩn thận, trung thực.",
        benefits: "Phụ cấp ca."
      },
      {
        job_id: 24,
        job_title: "Lễ tân Khách sạn",
        company_name: "Luxury Hotel VN",
        closed_date: new Date("2025-02-05"),
        salary: "10,000,000 - 14,000,000 VND",
        area: "Nha Trang",
        experience: "1 năm",
        degree: "Cao đẳng",
        post_user_id: 914,
        description: "Tiếp đón khách hàng.",
        requirements: "Giao tiếp tiếng Anh.",
        benefits: "Tip + service charge."
      },
      {
        job_id: 25,
        job_title: "Nhân viên Hành chính",
        company_name: "Office Support Co.",
        closed_date: new Date("2025-01-28"),
        salary: "12,000,000 - 15,000,000 VND",
        area: "Hà Nội",
        experience: "1-2 năm",
        degree: "Đại học",
        post_user_id: 915,
        description: "Soạn thảo văn bản, quản lý hồ sơ.",
        requirements: "Thành thạo Word, Excel.",
        benefits: "Giờ hành chính."
      },
      {
        job_id: 26,
        job_title: "Tài xế B2",
        company_name: "Transport Services",
        closed_date: new Date("2025-02-02"),
        salary: "12,000,000 - 14,000,000 VND",
        area: "TP. Hồ Chí Minh",
        experience: "2 năm",
        degree: "Không yêu cầu",
        post_user_id: 916,
        description: "Lái xe cho công ty.",
        requirements: "Bằng B2.",
        benefits: "Phụ cấp xăng xe."
      },
      {
        job_id: 27,
        job_title: "Nhân viên Thu ngân",
        company_name: "Retail Chain Store",
        closed_date: new Date("2025-01-18"),
        salary: "8,000,000 - 9,500,000 VND",
        area: "Huế",
        experience: "Không yêu cầu",
        degree: "Trung cấp",
        post_user_id: 917,
        description: "Thu ngân tại cửa hàng.",
        requirements: "Nhanh nhẹn.",
        benefits: "Thưởng ca."
      },
      {
        job_id: 28,
        job_title: "Chăm sóc Fanpage",
        company_name: "Social Media Boost",
        closed_date: new Date("2025-02-08"),
        salary: "10,000,000 - 12,000,000 VND",
        area: "Quảng Nam",
        experience: "1 năm",
        degree: "Cao đẳng",
        post_user_id: 918,
        description: "Trả lời tin nhắn khách hàng.",
        requirements: "Online thường xuyên.",
        benefits: "Làm việc linh hoạt."
      },
      {
        job_id: 29,
        job_title: "Nhân viên Sản xuất",
        company_name: "Manufacturing Excellence",
        closed_date: new Date("2025-02-12"),
        salary: "9,000,000 - 11,000,000 VND",
        area: "Đồng Nai",
        experience: "Không yêu cầu",
        degree: "Trung cấp",
        post_user_id: 919,
        description: "Làm việc tại xưởng.",
        requirements: "Sức khỏe tốt.",
        benefits: "Tăng ca tính riêng."
      },
      {
        job_id: 30,
        job_title: "Nhân viên Văn phòng",
        company_name: "Admin Support Hub",
        closed_date: new Date("2025-02-20"),
        salary: "11,000,000 - 13,000,000 VND",
        area: "Nghệ An",
        experience: "1 năm",
        degree: "Cao đẳng",
        post_user_id: 920,
        description: "Hỗ trợ công việc hành chính.",
        requirements: "Biết Excel cơ bản.",
        benefits: "Thưởng lễ tết."
      }
    ];

    console.log(`⏳ Đang bắt đầu chèn ${rawJobs.length} công việc mới...`);

    // ==============================================
    // 💥 BƯỚC 2: CHÈN TẤT CẢ DỮ LIỆU MỚI
    // ==============================================

    // Sử dụng insertMany để chèn nhanh hơn sau khi đã xóa toàn bộ
    // Tuy nhiên, để đảm bảo tính tường minh của job_id, ta vẫn dùng loop.
    for (const job of rawJobs) {
      await Job.create(job); // Dùng create thay vì findOneAndUpdate/upsert sau khi đã deleteMany
      console.log(`-> Đã chèn job: ${job.job_id}: ${job.job_title}`);
    }

    console.log("\n=============================================");
    console.log("✅ Quá trình Seeding (Xóa cũ & Chèn mới) HOÀN TẤT!");
    console.log("=============================================");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Lỗi trong quá trình seeding:", error);
    if (mongoose.connection.readyState === 1) {
        mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedJobs();