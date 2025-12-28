import Rating from "../models/Rating";
import User from "../models/User";

export async function createRatingService(data: {
  clientUsername: string;
  barberUsername: string;
  stars: number;
  comment?: string;
}) {
  const exists = await Rating.findOne({
    clientUsername: data.clientUsername,
    barberUsername: data.barberUsername
  });

  if (exists) {
    throw new Error("You already rated this barber");
  }

  return Rating.create(data);
}

export async function getRatingsForBarber(barberUsername: string) {
  return Rating.find({ barberUsername });
}

export async function getBarberByUsername(username: string) {
  return await User.findOne({ username, role: "barber" })
    .populate("avgRating")   // virtual ratings
    .lean();
}

export async function getBarberAverageRating(username: string) {
  const result = await Rating.aggregate([
    { $match: { barberUsername: username } },
    {
      $group: {
        _id: "$barberUsername",
        avgRating: { $avg: "$stars" },
        ratingCount: { $sum: 1 }
      }
    }
  ]);

  if (result.length === 0)
    return { avgRating: 0, ratingCount: 0 };

  return {
    avgRating: Number(result[0].avgRating.toFixed(1)),
    ratingCount: result[0].ratingCount
  };
}

export async function getAllBarbers() {
  const barbers = await User.find({ role: "barber" }).lean();

  const results = await Promise.all(
    barbers.map(async (b) => {
      const ratings = await Rating.find({ barberUsername: b.username }).lean();

      const ratingCount = ratings.length;
      const avgRating =
        ratingCount > 0
          ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratingCount
          : 0;

      return {
        ...b,
        avgRating: Number(avgRating.toFixed(1)),
        ratingCount,
      };
    })
  );

  return results;
}

export async function getAllRatings() {
 return Rating.find().select("");
}

export async function deleteRating(id: string) {
  return Rating.findByIdAndDelete(id);
}