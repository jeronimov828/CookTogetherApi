import { body } from "express-validator";

export const crearUsuarioValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre debe tener entre 3 y 50 caracteres"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no es válido")
    .normalizeEmail(),
  body("passwordHash")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("El rol debe ser 'user' o 'admin'"),
];

export const loginValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio"),
  body("passwordHash")
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),
];

export const actualizarUsuarioValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre debe tener entre 3 y 50 caracteres"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("El email no es válido")
    .normalizeEmail(),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("El rol debe ser 'user' o 'admin'"),
];

export const cambiarPasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("La contraseña actual es obligatoria"),
  body("newPassword")
    .notEmpty()
    .withMessage("La nueva contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La nueva contraseña debe tener al menos 6 caracteres"),
];

