import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, unique: true, required: true , match: /^\S+@\S+\.\S+$/},
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
  role: { type: String, default: "user" },
  provider: { type: String, default: "here" },
  resetToken: String,
  resetTokenExpires: Date,
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
