import Log from "../models/Log.js";
export const logActivity = async (userId, action, meta = {}) => {
  try {
    await Log.create({ user: userId, action, meta });
  } catch (err) {
    console.error("Activity logging failed:", err.message);
  }
};

