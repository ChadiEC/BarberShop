import Schedule from "../models/Schedule";

export async function createSchedule(data: any) {
  return Schedule.create(data);
}

export async function getScheduleForBarber(username: string) {
  return Schedule.find({ barberUsername: username }).sort({ day: 1 });
}

export async function updateSchedule(username: string, day: string, data: any) {
  return Schedule.findOneAndUpdate(
    { barberUsername: username, day },
    data,
    { new: true }
  );
}

export async function deleteSchedule(username: string, day: string) {
  return Schedule.findOneAndDelete({ barberUsername: username, day });
}
