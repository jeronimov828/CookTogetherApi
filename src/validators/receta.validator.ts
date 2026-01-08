import { body, param, query } from "express-validator";

export const crearRecetaValidator = [
  body("titulo")
    .trim()
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ min: 3, max: 200 })
    .withMessage("El título debe tener entre 3 y 200 caracteres"),
  body("descripcion")
    .trim()
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ min: 10 })
    .withMessage("La descripción debe tener al menos 10 caracteres"),
  body("dificultad")
    .notEmpty()
    .withMessage("La dificultad es obligatoria")
    .isIn(["fácil", "medio", "difícil", "facil", "medio", "dificil"])
    .withMessage("La dificultad debe ser: fácil, medio o difícil"),
  body("porciones")
    .notEmpty()
    .withMessage("Las porciones son obligatorias")
    .isInt({ min: 1 })
    .withMessage("Las porciones deben ser un número entero mayor a 0"),
  body("tiempo_min")
    .notEmpty()
    .withMessage("El tiempo es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El tiempo debe ser un número entero mayor a 0"),
  body("imagen_Url")
    .optional()
    .isURL()
    .withMessage("La URL de la imagen no es válida"),
  body("ingredientes")
    .isArray({ min: 1 })
    .withMessage("Debe haber al menos un ingrediente"),
  body("ingredientes.*.nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre del ingrediente es obligatorio"),
  body("pasos")
    .optional()
    .isArray()
    .withMessage("Los pasos deben ser un array"),
  body("pasos.*.orden")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El orden del paso debe ser un número entero mayor a 0"),
  body("pasos.*.contenido")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El contenido del paso es obligatorio"),
];

export const actualizarRecetaValidator = [
  body("titulo")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("El título debe tener entre 3 y 200 caracteres"),
  body("descripcion")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("La descripción debe tener al menos 10 caracteres"),
  body("dificultad")
    .optional()
    .isIn(["fácil", "medio", "difícil", "facil", "medio", "dificil"])
    .withMessage("La dificultad debe ser: fácil, medio o difícil"),
  body("porciones")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Las porciones deben ser un número entero mayor a 0"),
  body("tiempo_min")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El tiempo debe ser un número entero mayor a 0"),
  body("imagen_Url")
    .optional()
    .isURL()
    .withMessage("La URL de la imagen no es válida"),
];

export const idParamValidator = [
  param("id")
    .notEmpty()
    .withMessage("El ID es obligatorio")
    .isUUID()
    .withMessage("El ID debe ser un UUID válido"),
];

export const paginacionValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La página debe ser un número entero mayor a 0"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El límite debe ser un número entre 1 y 100"),
];

export const buscarRecetasValidator = [
  query("titulo")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("El título de búsqueda debe tener al menos 1 carácter"),
  query("dificultad")
    .optional()
    .isIn(["fácil", "medio", "difícil", "facil", "medio", "dificil"])
    .withMessage("La dificultad debe ser: fácil, medio o difícil"),
  query("tiempo_max")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El tiempo máximo debe ser un número entero mayor a 0"),
  ...paginacionValidator,
];

