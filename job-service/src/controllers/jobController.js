import Job from "../models/job.js";

export const getAllJobs = async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
};

export const createJob = async (req, res) => {
  const job = await Job.create(req.body);
  res.json(job);
};
