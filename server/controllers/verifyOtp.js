import User from "../models/User";

export const verifyOtp = async (req, res, next) => {
  try {
    const { userId, code } = req.body;
    const user = await User.findById(userId).select(
      "+otpHash +otpExpires +role"
    );

    if (
      !user ||
      !user.otpHash ||
      user.otpExpires < Date.now() ||
      user.otpHash !== hashOTP(code)
    )
      return res.status(401).json({ message: "Invalid or expired code" });

    // clear otp
    user.otpHash = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};
