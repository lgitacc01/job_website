import React from "react";
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job = {} }) => {
  const navigate = useNavigate();
  const {
    job_title = "Untitled",
    area = "N/A",
    salary,
    createdAt,
    isHot,
    company = "Công ty",
    company_name,
  tags = [],
  level,
  seniority,
  rank,
  experience,
  description,
  } = job;

  const displayCompany = company_name || company;

  // salary is stored as a string in the model. Display raw string when present.
  // If the string is purely numeric, format with thousand separators and append ' VND'.
  let formattedSalary = "Thỏa thuận";
  if (salary && typeof salary === 'string' && salary.trim().length > 0) {
    const s = salary.trim();
    // numeric check (allow commas/dots)
    const numeric = s.replace(/[\.,]/g, '').match(/^\d+$/);
    if (numeric) {
      formattedSalary = `${Number(s.replace(/[\.,]/g, '')).toLocaleString()} VND`;
    } else {
      formattedSalary = s; // show as provided
    }
  }

  const date = createdAt ? new Date(createdAt) : null;
  // detect possible expiration fields
  const expiryRaw = job.expiry || job.expireAt || job.expiresAt || job.end_date || job.deadline;
  const expiryDate = expiryRaw ? new Date(expiryRaw) : null;

  const formatDate = (d) => {
    if (!d || !(d instanceof Date) || isNaN(d)) return null;
    return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  const StatusBadge = ({ status }) => {
    if (!status) return null;
    const s = String(status).toLowerCase();
    if (s === 'available') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
          Còn hạn
        </span>
      );
    }
    if (s === 'outdate' || s === 'outdated') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800">
          Hết hạn
        </span>
      );
    }
    if (s === 'waitting') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
          Chờ duyệt
        </span>
      );
    }
    if (s === 'delete' || s === 'deleted') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
          Đã xóa
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
        {status}
      </span>
    );
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-5 border border-gray-100"
      tabIndex={0}
      onClick={() => {
        const token = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('user_id');
        if (!token || !userId) {
          navigate('/login');
          return;
        }
        if (job.job_id) navigate(`/job/${job.job_id}`);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          const token = localStorage.getItem('accessToken');
          const userId = localStorage.getItem('user_id');
          if (!token || !userId) {
            navigate('/login');
            return;
          }
          if (job.job_id) navigate(`/job/${job.job_id}`);
        }
      }}
      aria-label={`Job: ${job_title} at ${displayCompany}`}
      role="button"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
          {displayCompany?.charAt(0)?.toUpperCase() || "C"}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {job_title}
          </h3>
          <p className="text-sm text-gray-600">{displayCompany}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {area && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                <span className="text-base">📍</span> {area}
              </span>
            )}
            {formattedSalary && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                <span className="text-base">💸</span> {formattedSalary}
              </span>
            )}
            {experience && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                <span className="text-base">🎯</span> {experience}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-700 line-clamp-3">
        {description || "Mô tả đang cập nhật."}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs text-gray-500">ID: {job.job_id}</span>
        <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold shadow hover:bg-indigo-500 transition">
          Xem chi tiết
        </button>
      </div>

      <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-gray-200/70 group-hover:ring-indigo-300/70 transition" />
    </div>
  );
};

export default JobCard;
