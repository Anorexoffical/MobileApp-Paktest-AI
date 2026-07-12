import express from "express";
import {
  getAllTestBodies,
  getTestBodyById,
  createTestBody,
  updateTestBody,
  deleteTestBody,
} from "../controllers/testBodiesController.js";

const router = express.Router();

router.get("/", getAllTestBodies);
router.get("/:id", getTestBodyById);
router.post("/", createTestBody);
router.put("/:id", updateTestBody);
router.delete("/:id", deleteTestBody);

export default router;
