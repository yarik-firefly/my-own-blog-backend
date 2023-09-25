import express from "express";
import mongoose from "mongoose";
import {
  registerValidator,
  loginValidator,
  postCreateValidator,
  commentCreateValidator,
} from "./validations/validations.js";
import multer from "multer";
import {
  CommentController,
  PostController,
  UserController,
} from "./controllers/index.js";
import { checkAuth, handleValidatorError } from "./utils/index.js";
import cors from "cors";
import fs from "fs";

mongoose
  .connect(process.env.MONGO_DB_BASE)
  .then(() => {
    console.log("DB ok!");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

const PORT = process.env.PORT || 4444;

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hello Pidor :)");
});

app.get("/auth/me", checkAuth, UserController.authMe);
app.post(
  "/auth/login",
  loginValidator,
  handleValidatorError,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidator,
  handleValidatorError,
  UserController.register
);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", PostController.getAll);
app.get("/tags", PostController.getLastTags);
app.get("/posts/comment/:id", CommentController.getOneComment);
app.get("/posts/comments", CommentController.getAll);

app.post(
  "/posts/:id",
  checkAuth,
  commentCreateValidator,
  CommentController.createComment
);

app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidator, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidator, PostController.update);

app.listen(PORT, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log("SERVER RUN");
});
