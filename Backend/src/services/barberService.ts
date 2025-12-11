import User from "../models/User";

export async function getAllBarbers() {
  return User.find({ role: "barber" }).select("-password");
}

export async function getBarberByUsername(username: string) {
  return User.findOne({ username, role: "barber" }).select("-password");
}

export async function createBarber(data: any) {
  return User.create({
    ...data,
    role: "barber",
  });
}


export async function updateBarberProfile(username: string, data: any) {
  return User.findOneAndUpdate(
    { username, role: "barber" },
    data,
    { new: true }
  ).select("-password");
}


export async function deleteBarber(username: string) {
  return User.findOneAndDelete({ username });
}