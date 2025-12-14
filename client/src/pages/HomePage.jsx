import React, { useState, useEffect, useRef } from "react";
import axiosClient from "../api/axiosClient";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setAnimating(true);
        setLoading(true);

        const res = await axiosClient.get(
          "/recommend/recommend/recommend",
          { params: { page } }
        );

        setJobs(res.data?.data || []);
        setTotalPages(res.data?.totalPages || 1);
      } catch (err) {
        console.error(err);
        setJobs([]);
      } finally {
        setLoading(false);
        setTimeout(() => {
          setAnimating(false);
        }, 50);
      }
    };

    fetchJobs();
  }, [page]);

  // Ref to the job list container so pagination can scroll to it when needed
  const listRef = useRef(null);
  const shouldScrollRef = useRef(false);

  useEffect(() => {
    if (shouldScrollRef.current && listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      shouldScrollRef.current = false;
    }
  }, [jobs]);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* ===== NAVBAR ===== */}
      <Navbar />

      {/* ===== SEARCH WITH BACKGROUND IMAGE ===== */}
      <div 
        className="relative py-24 overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1920')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay để làm tối hình nền */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-700/80"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <h1 className="text-white text-5xl font-extrabold text-center mb-3">
            Tìm Công Việc Mơ Ước Của Bạn
          </h1>
          <p className="text-blue-100 text-center mb-8 text-lg">
            Hàng nghìn cơ hội việc làm đang chờ đón bạn
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              className="flex-1 px-6 py-4 rounded-lg border-2 border-transparent outline-none focus:border-blue-400 transition-all shadow-xl bg-white/95"
              placeholder="Nhập tên vị trí, công ty, từ khóa"
            />
            <input
              className="w-64 px-5 py-4 rounded-lg border-2 border-transparent outline-none focus:border-blue-400 transition-all shadow-xl bg-white/95"
              placeholder="Tỉnh/thành"
            />
            <button className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg hover:bg-yellow-400 transition-all duration-200 font-bold shadow-xl hover:shadow-2xl">
              🔍 Tìm kiếm
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
      </div>

      {/* ===== JOB SECTION ===== */}
      <div className="max-w-6xl mx-auto px-4 mt-10 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Việc làm hấp dẫn</h2>
          <span className="text-blue-600 cursor-pointer hover:underline font-medium hover:text-blue-700 transition-colors">
            Xem tất cả →
          </span>
        </div>

        {/* ===== JOB LIST ===== */}
        <div
          ref={listRef}
          className={`
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8
            transition-all duration-300 ease-out
            ${animating ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"}
          `}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 bg-gray-200 rounded-xl animate-pulse shadow-sm"
                />
              ))
            : jobs.map((job) => (
                <div key={job._id || job.job_id} className="h-full">
                  <JobCard job={job} />
                </div>
              ))}
        </div>

        {/* ===== PAGINATION (MODERN DESIGN) ===== */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            disabled={page === 1}
            onClick={() => {
              shouldScrollRef.current = true;
              setPage((p) => Math.max(1, p - 1));
            }}
            className={`
              group relative px-5 py-2.5 rounded-lg font-medium
              transition-all duration-200 flex items-center gap-2
              ${
                page === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-blue-600 hover:bg-blue-600 hover:text-white shadow-md hover:shadow-lg border border-blue-200"
              }
            `}
          >
            <svg 
              className="w-5 h-5 transition-transform group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Trước</span>
          </button>

          <div className="px-6 py-2.5 bg-white rounded-lg shadow-md border border-gray-200">
            <span className="text-sm text-gray-600">
              Trang <span className="font-bold text-blue-600 text-base">{page}</span> / {totalPages}
            </span>
          </div>

          <button
            disabled={page >= totalPages}
            onClick={() => {
              shouldScrollRef.current = true;
              setPage((p) => Math.min(totalPages, p + 1));
            }}
            className={`
              group relative px-5 py-2.5 rounded-lg font-medium
              transition-all duration-200 flex items-center gap-2
              ${
                page >= totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-blue-600 hover:bg-blue-600 hover:text-white shadow-md hover:shadow-lg border border-blue-200"
              }
            `}
          >
            <span className="hidden sm:inline">Sau</span>
            <svg 
              className="w-5 h-5 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;