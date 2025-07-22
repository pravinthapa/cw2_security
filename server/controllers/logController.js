import Log from "../models/Log.js";

export const getLogs = async (req, res, next) => {
  try {
    const logs = await Log.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};
