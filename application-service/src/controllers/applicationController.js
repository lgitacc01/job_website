import Application from "../models/application.js";

export const getAllApplications = async (req, res) => {
  const apps = await Application.find();
  res.json(apps);
};

export const createApplication = async (req, res) => {
  const app = await Application.create(req.body);
  res.json(app);
};
