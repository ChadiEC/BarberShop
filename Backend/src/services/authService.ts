import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import crypto from "crypto";

export async function registerUser(fullname:string, email: string, password: string,username: string,phoneNumber:string) {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("Email already used");

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullname,
    email,
    password: hashed,
    username,
    phoneNumber
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid email or password");

  // Génération du token
  const token = jwt.sign(
    { id: user._id,email: user.email,username: user.username,role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { user, token };
}


export async function changePasswordService(userId: string, currentPassword: string, newPassword: string) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // check old password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Current password is incorrect");

  // hash new password
  const hashed = await bcrypt.hash(newPassword, 10);

  user.password = hashed;
  await user.save();

  return true;
}


export async function requestPasswordReset(email: string) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("No user found with that email");

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  user.resetPasswordToken = token;
  user.resetPasswordExpires = expires;
  await user.save();

  return token;
}


export async function resetPassword(token: string, newPassword: string) {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() }
  });

  if (!user) throw new Error("Invalid or expired reset token");

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
}
