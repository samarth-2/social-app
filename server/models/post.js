const mongoose = require("../database/database");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, 
  }
);

postSchema.virtual("comments", {
  ref: "Comment",          
  localField: "_id",       
  foreignField: "post",    
});

postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });



const Post = mongoose.model("Post", postSchema);

module.exports = Post;
