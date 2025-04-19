import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["student", "alumni"],
    required: true
  },
  batch: {
    type: String,
    required: true
  },
  jobtitle:{
    type:String,
    required:true
  },
  branch:{
    type:String,
    required:true
  },
  location:{
    type:String,
    required:true
  },
  image:{
    type:String,
    required:false
  }
    
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
