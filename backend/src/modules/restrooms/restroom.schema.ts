import { z } from "zod";

export const createRestroomSchema = z.object({
  name: z.string().min(1, "Name is required"),
  detail: z.string().optional(),
  address: z.string().optional(),
  openingHours: z.string().optional(),
  closingHours: z.string().optional(),
  type: z.enum(["squat", "flush", "other"]),
  isFree: z.boolean(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const updateRestroomSchema = z.object({
  name: z.string().min(1, "Name is required"),
  detail: z.string().optional(),
  address: z.string().optional(),
  openingHours: z.string().optional(),
  closingHours: z.string().optional(),
  type: z.enum(["squat", "flush", "other"]),
  isFree: z.boolean(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});
