import Recommend from "../models/recommend.js";

export const getAllRecommends = async (req, res) => {
  const recs = await Recommend.find();
  res.json(recs);
};

export const createRecommend = async (req, res) => {
  const rec = await Recommend.create(req.body);
  res.json(rec);
};
