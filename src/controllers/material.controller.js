const Material = require("../models/material.model");
const path = require("path");
const fs = require("fs");

// رفع ملف
exports.uploadMaterial = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // حفظ بيانات الملف في قاعدة البيانات
    const material = new Material({
      courseId,
      instructorId: req.user._id,
      fileName: req.file.filename,
      fileUrl: `/uploads/materials/${req.file.filename}`,
    });

    await material.save();

    res.status(201).json({ message: "File uploaded successfully", material });
  } catch (error) {
    next(error);
  }
};

// جلب جميع الملفات الخاصة بكورس معين
exports.getMaterialsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const materials = await Material.find({ courseId }).sort({
      uploadedAt: -1,
    });
    res.status(200).json(materials);
  } catch (error) {
    next(error);
  }
};

// حذف ملف
exports.deleteMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    // حذف الملف من السيرفر
    const filePath = path.join(
      __dirname,
      "../uploads/materials",
      material.fileName
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // حذف السجل من قاعدة البيانات
    await Material.findByIdAndDelete(id);
    res.status(200).json({ message: "Material deleted successfully" });
  } catch (error) {
    next(error);
  }
};
