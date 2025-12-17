import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getAvailabilty = async (req: Request, res: Response) => {
  const { startTime, endTime } = req.query;

  if (!startTime || !endTime) {
    return res.status(400).json({
      message: "Start and end time is required",
    });
  }

  const start = new Date(startTime as string);
  const end = new Date(endTime as string);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
    return res.status(400).json({
      message: "Invalid time range",
    });
  }

  try {
    const courts = await prisma.court.findMany({
      where: {
        isActive: true,
        bookings: {
          none: {
            booking: {
              NOT: {
                OR: [{ endTime: { lte: start } }, { startTime: { gte: end } }],
              },
            },
          },
        },
      },
    });

    const coaches = await prisma.coach.findMany({
      where: {
        isActive: true,
        bookings: {
          none: {
            booking: {
              NOT: {
                OR: [{ endTime: { lte: start } }, { startTime: { gte: end } }],
              },
            },
          },
        },
      },
    });

    const equipment = await prisma.equipment.findMany({
      where: {
        isActive: true,
        bookings: {
          none: {
            booking: {
              NOT: {
                OR: [{ endTime: { lte: start } }, { startTime: { gte: end } }],
              },
            },
          },
        },
      },
    });

    const equipmentAvailabilty = equipment.map((item: any) => {
      const bookedQty = item.bookings.reduce(
        (sum: any, booking: any) => sum + booking.quantity,
        0
      );

      return {
        id: item.id,
        name: item.name,
        totalQty: item.totalQty,
        availableQty: Math.max(item.totalQty - bookedQty, 0),
      };
    });

    return res.status(201).json({
      message: "Available item fethed successfully",
      courts,
      coaches,
      equipment: equipmentAvailabilty,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server error ",
    });
  }
};
