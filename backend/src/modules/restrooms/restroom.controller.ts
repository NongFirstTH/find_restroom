import type { Context } from "hono";
import { RestroomService } from "./restroom.service.js";
import {
  createRestroomSchema,
  updateRestroomSchema,
} from "./restroom.schema.js";
import { z } from "zod";

const restroomService = new RestroomService();

// region get
export const getAllRestrooms = async (c: Context) => {
  try {
    const restrooms = await restroomService.getAllRestrooms();
    return c.json(restrooms);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const getRestroomsByBounds = async (c: Context) => {
  try {
    const { minLat, maxLat, minLng, maxLng } = c.req.query();

    if (!minLat || !maxLat || !minLng || !maxLng) {
      return c.json({ error: "Missing coordinate bounds" }, 400);
    }

    const restrooms = await restroomService.getRestroomsByBounds(
      parseFloat(minLat),
      parseFloat(maxLat),
      parseFloat(minLng),
      parseFloat(maxLng),
    );

    return c.json(restrooms);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const getRestroomById = async (c: Context) => {
  try {
    const id = c.req.param("id");
    if (!id) {
      return c.json({ error: "ID is required" }, 400);
    }

    const restroom = await restroomService.getRestroomById(id);
    if (!restroom) {
      return c.json({ error: "Restroom not found" }, 404);
    }

    return c.json(restroom);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const getRestroomCount = async (c: Context) => {
  try {
    const count = await restroomService.getRestroomCount();
    return c.json(count);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// region create
export const createRestroom = async (c: Context) => {
  try {
    const body = await c.req.json();
    const validated = createRestroomSchema.parse(body);

    const userId = c.get("userId");
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const restroom = await restroomService.createRestroom({
      ...validated,
      createdBy: userId,
    });

    return c.json(restroom, 201);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return c.json({ errors: error.errors }, 400);
    }
    return c.json({ error: error.message }, 500);
  }
};

// region update
export const updateRestroom = async (c: Context) => {
  try {
    const id = c.req.param("id");
    if (!id) {
      return c.json({ error: "ID is required" }, 400);
    }
    const body = await c.req.json();
    const validated = updateRestroomSchema.parse(body);

    const userId = c.get("userId");
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const restroom = await restroomService.updateRestroom(
      id,
      validated,
    );
    return c.json(restroom);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return c.json({ errors: error.errors }, 400);
    }
    return c.json({ error: error.message }, 500);
  }
};

// region delete
export const deleteRestroom = async (c: Context) => {
  try {
    const id = c.req.param("id");
    if (!id) {
      return c.json({ error: "ID is required" }, 400);
    }
    
    const userId = c.get("userId");
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await restroomService.deleteRestroom(id);
    return c.json({ message: "Restroom deleted successfully" });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
