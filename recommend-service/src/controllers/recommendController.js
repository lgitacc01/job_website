import Recommend from "../models/recommend.js";
import axios from "axios";
const JOB_SERVICE_URL = "http://job-service:3002/job"

export const getAllRecommends = async (req, res) => {
  const recs = await Recommend.find();
  res.json(recs);
};

export const createRecommend = async (req, res) => {
  const rec = await Recommend.create(req.body);
  res.json(rec);
};

const extractUserId = (decoded) => {
  if (!decoded) return null;

  return (
    decoded.user_id ||
    decoded.id ||
    decoded._id ||
    decoded.user?.user_id ||
    decoded.user?.id ||
    decoded.user?._id ||
    null
  );
};

export const getJobRecommendations = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const page = parseInt(req.query.page, 10) || 1;

    // =========================
    // CASE 1: KHÔNG ĐĂNG NHẬP
    // =========================
    if (!token) {
      const response = await axios.get(
        `${JOB_SERVICE_URL}/home`,
        { params: { page } }
      );

      return res.status(200).json(response.data);
    }

    // =========================
    // CASE 2: CÓ ĐĂNG NHẬP
    // =========================
    const userId = extractUserId(req.user);

    let q = "";
    let province = "";
    let viewedJobs = [];

    const history = await Recommend.findOne({ userId });
    if (history) {
      q = history.last_search || "";
      province = history.area || "";
      viewedJobs = history.viewed_jobs || [];
    }

    const response = await axios.get(
      `${JOB_SERVICE_URL}/search_fill`,
      {
        params: {
          q,
          province,
          page,
          excludeIds: viewedJobs.join(","),
        },
        headers: { Authorization: token },
      }
    );

    const jobsData = response.data;
    const jobs = jobsData.data || [];

    // Lưu viewed_jobs
    if (jobs.length > 0) {
      const newJobIds = jobs
        .map(j => j.job_id)
        .filter(id => !viewedJobs.includes(id));

      const updatedViewedJobs = [...viewedJobs, ...newJobIds].slice(0, 6);

      await Recommend.updateOne(
        { userId },
        { $set: { viewed_jobs: updatedViewedJobs } },
        { upsert: true }
      );
    }

    return res.status(200).json(jobsData);

  } catch (error) {
    console.error("❌ Lỗi API Recommend:", error.message);

    return res.status(500).json({
      message: "Lỗi nội bộ server.",
    });
  }
};
