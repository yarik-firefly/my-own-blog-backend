import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    comment: { type: String, required: true},
    countComment: {type: Number}
  },

  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
