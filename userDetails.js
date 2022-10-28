import mongoose from "mongoose";

const UserDetailsSchema = new mongoose.Schema(
  {
    name: String,
    lastname: String,
    email: { type: String, unique: true },
    password: String,
    position: String,
    skills: Object
  },
  {
    collection: "User",
  }
);

export default mongoose.model("User", UserDetailsSchema);
