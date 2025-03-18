const express = require("express");
const upload = require("../services/upload.service");
const {
  uploadMaterial,
  getMaterialsByCourse,
  deleteMaterial,
} = require("../controllers/material.controller");
const { protect, checkRole } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/upload",
  protect,
  checkRole("instructor"),
  upload.single("file"),
  uploadMaterial
);

router.get("/:courseId", protect, getMaterialsByCourse);

router.delete("/:id", protect, checkRole("instructor"), deleteMaterial);

module.exports = router;
