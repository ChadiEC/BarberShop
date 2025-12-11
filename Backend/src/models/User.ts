import { Schema, model, Document } from "mongoose";

export interface IUserModel extends Document {
    fullname: string;
    email: string;
    password: string;
    username: string;
    role: "client" | "barber" | "admin";
    phoneNumber?: string;
    bio?: string;
    photoUrl?: string;
    specialties?: string[];
    experience?: number;
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

    phoneNumber: { type: String},

    bio: { type: String, default: "" },

    photoUrl: { type: String, default: "" },

    specialties: { type: [String], default: [] },

    experience: { type: Number, default: 0 }

}, { timestamps: true });

export default model<IUserModel>("User", UserSchema);
