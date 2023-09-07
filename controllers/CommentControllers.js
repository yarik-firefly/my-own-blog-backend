import CommentModel from "../models/CommentModel.js";
import PostModel from "../models/PostModel.js";

export const getAll = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate("user").exec();
    // const popularPosts = await PostModel.find().sort("-views");

    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить все комментарии!",
    });
  }
};

export const getOneComment = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    const list = await Promise.all(
      post.comments.map((item) => {
        return CommentModel.findById(item).populate("user").exec();
      })
    );

    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ошибка при загрузке комментариев",
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const comment = await req.body.value;
    const id = req.params.id;
    const user = req.userId;

    if (!comment) {
      return res.json({ message: "Введите текст!" });
    }

    const newComment = new CommentModel({
      comment,
      user,
    });

    await PostModel.findByIdAndUpdate(id, {
      $push: { comments: newComment._id },
    });
    await newComment.save();

    return res.json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ошибка при добавлении комментария",
    });
  }
};
