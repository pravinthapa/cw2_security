import jwt from "jsonwebtoken";
import Contact from "../models/Contact.js";
import User from "../models/User.js";

/**
 * POST /api/access/request
 * Body: { contactEmail }
 */
export const issueEmergencyToken = async (req, res, next) => {
  try {
    const { contactEmail } = req.body;

    const contactUser = await User.findOne({ email: contactEmail });
    if (!contactUser) return res.status(404).json({ message: "Contact not found" });

    const contact = await Contact.findOne({
      owner: req.user.userId,
      contactUser: contactUser._id,
      canViewVault: true,
    });

    if (!contact)
      return res.status(403).json({ message: "You have not granted access to this user" });

    const tempToken = jwt.sign(
      {
        userId: contactUser._id,
        role: "EMERGENCY_CONTACT",
        accessType: "TEMP",
      },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.json({ token: tempToken, expiresIn: 600 });
  } catch (err) {
    next(err);
  }
};
