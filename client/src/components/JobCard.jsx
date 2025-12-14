import React from "react";

const JobCard = ({ job = {} }) => {
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

  return (
    <article
      className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transform-gpu hover:scale-105 transition-all duration-200 relative flex flex-col h-full justify-between border border-transparent hover:border-blue-50"
  aria-label={`Job: ${job_title} at ${displayCompany}`}
      role="article"
    >
      {/* Left: Badge / Company avatar */}
      <div className="flex-shrink-0">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
          {displayCompany?.charAt(0)?.toUpperCase() || "C"}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="pr-4 min-w-0 flex-1">
            <h3 className="text-gray-900 text-base md:text-lg font-semibold mb-1 line-clamp-2">
              {job_title}
            </h3>
            <p className="text-sm text-gray-500 truncate">{displayCompany}</p>
            <p className="text-sm text-gray-600 mt-1">{area}</p>
            {experience ? (
              <p className="text-sm text-indigo-800 mt-1">Kinh nghiệm: {experience}</p>
            ) : null}
            {/* Salary moved down into main content */}
            <p className="mt-3 text-sm text-gray-700 font-medium">{formattedSalary}</p>
          </div>

          <div className="text-right flex flex-col items-end gap-2">
            {isHot && (
              <span className="inline-block bg-orange-400 text-white text-xs px-2 py-1 rounded-full">HOT</span>
            )}
          </div>
        </div>

        {/* (intentionally omitted tags and actions) */}
      </div>
    </article>
  );
};

export default JobCard;
