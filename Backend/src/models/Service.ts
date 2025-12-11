import { Schema, model, Document } from "mongoose";

export interface IServiceModel extends Document {
  name: string;          // ex: Coupe Homme
  duration: number;      // en minutes
  price: number;         // ex: 25$
  description?: string;  // facultatif
  photoUrl?: string;     // pour l'affichage dans l'app
}

const ServiceSchema = new Schema<IServiceModel>({
  name: { type: String, required: true, unique:true,trim: true },
  duration: { type: Number, required: true }, // minutes
  price: { type: Number, required: true },

  description: { type: String, default: "" },

  photoUrl: { type: String, default: "" },

}, { timestamps: true });

export default model<IServiceModel>("Service", ServiceSchema);