import User from "../models/User";

//(-password) pour eviter l'exposition du hash et pas de fuite de donnée 
export async function getAllUsers() {
  return User.find().select("-password");
}

export async function getUserByUsername(username: string) {
  return User.findOne({username}).select("-password");
}

export async function createUser(data: { username: string; email: string; password: string; role?: string }) {
  return User.create(data);
}

export async function updateUser(username: string, data: any) {
  return User.findOneAndUpdate({username}, data, { new: true }).select("-password");
}

export async function deleteUser(username: string) {
  return User.findOneAndDelete({username});
}
