import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";

const router = Router();

// POST /tasks
router.post("/", createTask);

// GET /tasks
router.get("/", getTasks);

// PATCH /tasks/:id
router.patch("/:id", updateTask);

// DELETE /tasks/:id
router.delete("/:id", deleteTask);

export default router;
