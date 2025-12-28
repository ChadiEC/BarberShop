import { Schema, model, Document } from "mongoose";

export interface IUserModel extends Document {
    fullname: string;
    email: string;
    password: string;
    username: string;
    role: "client" | "barber" | "admin";
    phoneNumber?: string | undefined;
    bio?: string | undefined;
    photoUrl?: string | undefined;
    specialties?: string[] | undefined;
    experience?: number | undefined;
    resetPasswordToken?: string | undefined;
    resetPasswordExpires?: Date | undefined;
}

const UserSchema = new Schema<IUserModel>({
    fullname: { type: String, required: true, trim: true },

    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true,
    },

    password: { type: String, required: true },

    username: { type: String, required: true, unique: true, trim: true },

    role: { 
        type: String, 
        enum: ["client", "barber", "admin"], 
        default: "client" 
    },

    phoneNumber: { type: String },

    bio: { type: String, default: "" },

    photoUrl: { type: String, default: "" },

    specialties: { type: [String], default: [] },

    experience: { type: Number, default: 0 },

    resetPasswordToken: { type: String },

    resetPasswordExpires: { type: Date },

}, { timestamps: true });


UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

// VIRTUAL: AVG RATING (list of ratings, not computed)

UserSchema.virtual("avgRating", {
  ref: "Rating",
  localField: "username",
  foreignField: "barberUsername",
  justOne: false,
});


export default model<IUserModel>("User", UserSchema);
