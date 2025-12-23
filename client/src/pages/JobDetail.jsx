import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // small date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    } catch (_) {
      return null;
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/job/job/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error(err);
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          // Redirect unauthenticated/forbidden users to login
          navigate('/login');
          return;
        }
        setError('Không thể tải thông tin công việc.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  if (loading) return (<div className="min-h-screen"><Navbar /><div className="max-w-3xl mx-auto p-6">Đang tải...</div></div>);
  if (error) return (<div className="min-h-screen"><Navbar /><div className="max-w-3xl mx-auto p-6">{error}</div></div>);
  if (!job) return null;

  const handleApply = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    // TODO: call apply API
    alert('Ứng tuyển API chưa được triển khai.');
  };

  const handleSave = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    // TODO: call save API
    alert('Lưu API chưa được triển khai.');
  };

  const closedDateStr = formatDate(job.closed_date || job.closedDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full min-h-screen flex items-start justify-center py-6">
        <div className="w-full max-w-4xl mx-4 p-6">
          <div className="bg-white p-6 rounded-lg shadow w-full">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
              {(job.company_name || job.company || 'C').charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold">{job.job_title}</h1>
              <p className="text-sm text-gray-500">{job.company_name || job.company || '—'}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">{job.experience || 'Kinh nghiệm: —'}</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{job.degree || 'Bằng cấp: —'}</span>
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{job.area || 'Khu vực: —'}</span>
                <span className="text-sm text-gray-700 font-medium ml-2">{job.salary || 'Thỏa thuận'}</span>
                {/* removed closed date badge from header */}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex gap-2">
                <button onClick={handleApply} className="px-4 py-2 bg-blue-600 text-white rounded">Ứng tuyển</button>
                <button onClick={handleSave} className="px-4 py-2 border rounded">Lưu</button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold mb-2">Mô tả</h2>
            <div className="text-sm text-gray-700 whitespace-pre-line">{job.description || '—'}</div>
          </div>

          <div className="mt-4">
            <h2 className="font-semibold mb-2">Yêu cầu</h2>
            <div className="text-sm text-gray-700 whitespace-pre-line">{job.requirements || '—'}</div>
          </div>

          <div className="mt-4">
            <h2 className="font-semibold mb-2">Quyền lợi</h2>
            <div className="text-sm text-gray-700 whitespace-pre-line">{job.benefits || '—'}</div>
          </div>

          {/* bottom section for close date */}
          {closedDateStr && (
            <div className="mt-6 pt-4 border-t">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Hạn nộp hồ sơ:</span> {closedDateStr}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default JobDetail;
