import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

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

