const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { sendVerificationEmail } = require("../services/email.service");
const User = require("../models/user.model");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, username, email },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const sendResetCode = async (req, res, next) => {
  try {
    let { email } = req.body;
    email = email?.trim().toLowerCase();

    if (!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res
        .status(200)
        .json({ message: "Reset code sent if email exists" });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    await User.updateOne(
      { email },
      {
        resetPasswordCode: hashedCode,
        resetPasswordExpires: Date.now() + 15 * 60 * 1000, // 15 دقيقة
      }
    );

    await sendVerificationEmail(email, resetCode);

    res.status(200).json({ message: "Reset code sent if email exists" });
  } catch (error) {
    console.error("Error in sendResetCode:", error);
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    let { email, code, newPassword } = req.body;
    email = email?.trim().toLowerCase();
    code = code?.trim();
    newPassword = newPassword?.trim();

    if (!email || !code || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const user = await User.findOne({ email }).select(
      "+resetPasswordCode +resetPasswordExpires -password"
    );
    console.log(user);

    if (
      !user ||
      !user.resetPasswordCode ||
      Date.now() > user.resetPasswordExpires
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");
    console.log(hashedCode);
    console.log(user.resetPasswordCode);

    if (hashedCode !== user.resetPasswordCode) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "Password changed successfully. You can now log in." });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    next(error);
  }
};

module.exports = {
  register,
  login,
  sendResetCode,
  resetPassword,
};
