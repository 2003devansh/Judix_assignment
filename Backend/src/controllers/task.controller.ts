import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

// POST /tasks
export const createTask = async (req: Request, res: Response) => {
  const { title, description, userId } = req.body;

  if (!title || !userId) {
    return res.status(400).json({
      message: "Title and userId are required",
    });
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        user: {
          connect: { id: userId },
        },
      },
    });

    res.status(201).json({
      task,
      message: "Task created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create task" });
  }
};

// GET /tasks
export const getTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// PATCH /tasks/:id
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        completed,
      },
    });

    res.status(200).json({
      updatedTask,
      message: "Task updated successfully",
    });
  } catch (error) {
    res.status(404).json({ message: "Task not found" });
  }
};

// DELETE /tasks/:id
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: "Task not found" });
  }
};
