import { body } from "express-validator";

export const loginValidator = [
  body("email", "Неверно указана почта").isEmail(),
  body("password", "Длина пароля должна быть от 8 до 30 символов").isLength({
    min: 8,
    max: 30,
  }),
];

export const registerValidator = [
  body("email", "Неверно указана почта").isEmail(),
  body("password", "Длина пароля должна быть от 8 до 30 символов").isLength({
    min: 8,
    max: 30,
  }),
  body("fullname", "Укажите имя").isLength({ min: 3 }),
  body("avatarUrl", "Неверная ссылка на аватар").optional().isURL(),
];

export const postCreateValidator = [
  body("title", "Введите заголовок статьи").isLength({ min: 3 }).isString(),
  body("text", "Введите текст статьи")
    .isLength({
      min: 3,
    })
    .isString(),
  body("tags", "Неверный формат тэгов").optional().isString(),
  body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];
