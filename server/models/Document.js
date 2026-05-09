import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },      
    storedName: { type: String, required: true },    
    fileType: { type: String, required: true },      
    size: { type: Number },                          
    summary: { type: String, default: "" },          
    content: { type: String, required: true },       
  },
  { timestamps: true }
);

export default mongoose.model("Document", DocumentSchema);
