import PostModel from "../models/PostModel.js";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить тэги!",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить статьи!",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      { returnDocument: "after" }
    )
      .populate("user")
      .then((doc) => {
        if (!doc) {
          res.status(404).json({
            message: "Статья не найдена!",
          });
        }

        res.json(doc);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: "Не удалось получить статью :(",
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить статьи!",
    });
  }
};

export const remove = async (req, res) => {
  const postId = req.params.id;

  PostModel.findOneAndDelete({
    _id: postId,
  })
    .then((doc) => {
      if (!doc) {
        res.status(404).json({
          message: "Статья не найдена!",
        });
      }

      res.json({
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: "Не удалось удалить статью :(",
      });
    });
};

export const update = async (req, res) => {
  const postId = req.params.id;

  PostModel.updateOne(
    {
      _id: postId,
    },
    {
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags.split(","),
      imageUrl: req.body.imageUrl,
      user: req.userId,
    }
  )
    .then((doc) => {
      if (!doc) {
        res.status(404).json({
          message: "Статья не найдена!",
        });
      }

      res.json({
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: "Не удалось обновить статью :(",
      });
    });
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags.split(","),
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать статью!",
    });
  }
};
