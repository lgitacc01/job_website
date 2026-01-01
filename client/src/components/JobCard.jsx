import React from "react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job = {} }) => {
  const navigate = useNavigate();

  const {
    job_title = "Untitled",
    area = "N/A",
    salary,
    createdAt,
    company = "Công ty",
    company_name,
    experience,
    description,
  } = job;

  const displayCompany = company_name || company;

  let formattedSalary = "Thỏa thuận";
  if (salary && typeof salary === "string" && salary.trim()) {
    const s = salary.trim();
    const numeric = s.replace(/[\.,]/g, "").match(/^\d+$/);
    formattedSalary = numeric
      ? `${Number(s.replace(/[\.,]/g, "")).toLocaleString()} VND`
      : s;
  }

  return (
    <div
      className="
        relative bg-white rounded-2xl border border-gray-100
        shadow-lg hover:shadow-2xl transition-all
        p-5 h-[360px] flex flex-col
      "
      role="button"
      tabIndex={0}
      onClick={() => {
        const token = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("user_id");
        if (!token || !userId) {
          navigate("/login");
          return;
        }
        if (job.job_id) navigate(`/job/${job.job_id}`);
      }}
    >
      {/* ===== HEADER ===== */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
          {displayCompany?.charAt(0)?.toUpperCase() || "C"}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 min-h-[48px]">
            {job_title}
          </h3>
          <p className="text-sm text-gray-600 truncate">
            {displayCompany}
          </p>

          <div className="mt-2 flex flex-wrap gap-2 min-h-[32px]">
            {area && (
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                📍 {area}
              </span>
            )}
            {formattedSalary && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                💸 {formattedSalary}
              </span>
            )}
            {experience && (
              <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                🎯 {experience}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ===== DESCRIPTION ===== */}
      <div className="mt-4 text-sm text-gray-700 line-clamp-3 min-h-[60px]">
        {description || "Mô tả đang cập nhật."}
      </div>

      {/* ===== FOOTER ===== */}
      <div className="mt-auto flex items-center justify-between pt-4">
        <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition">
          Xem chi tiết
        </button>
      </div>

      <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-gray-200/70" />
    </div>
  );
};

export default JobCard;
