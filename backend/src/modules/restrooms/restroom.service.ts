import { es } from "zod/v4/locales";
import { restroomsTable } from "../../db/schema.js";
import { db } from "../../index.js";
import { eq, sql } from "drizzle-orm";

interface CreateRestroomInput {
  name: string;
  detail?: string;
  address?: string;
  openingHours?: string;
  closingHours?: string;
  type: string;
  isFree: boolean;
  latitude: number;
  longitude: number;
  createdBy: string;
}

interface UpdateRestroomInput {
  name: string;
  detail?: string;
  address?: string;
  openingHours?: string;
  closingHours?: string;
  type: string;
  isFree: boolean;
  latitude: number;
  longitude: number;
}

export class RestroomService {
  // region get
  async getAllRestrooms() {
    let query = db
      .select({
        restroomId: restroomsTable.restroomId,
        name: restroomsTable.name,
        detail: restroomsTable.detail,
        address: restroomsTable.address,
        openingHours: restroomsTable.openingHours,
        closingHours: restroomsTable.closingHours,
        type: restroomsTable.type,
        isFree: restroomsTable.isFree,
        latitude: sql`ST_Y(location)`,
        longitude: sql`ST_X(location)`,
        createdBy: restroomsTable.createdBy,
        createdAt: restroomsTable.createdAt,
        updatedAt: restroomsTable.updatedAt,
      })
      .from(restroomsTable);

    const result = await query.execute();

    return result.map((r: any) => ({
      ...r,
      latitude: parseFloat(r.latitude),
      longitude: parseFloat(r.longitude),
    }));
  }

  async getRestroomsByBounds(
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number,
  ) {
    const result = await db
      .select({
        restroomId: restroomsTable.restroomId,
        name: restroomsTable.name,
        detail: restroomsTable.detail,
        address: restroomsTable.address,
        openingHours: restroomsTable.openingHours,
        closingHours: restroomsTable.closingHours,
        type: restroomsTable.type,
        isFree: restroomsTable.isFree,
        latitude: sql`ST_Y(location)`,
        longitude: sql`ST_X(location)`,
        createdBy: restroomsTable.createdBy,
        createdAt: restroomsTable.createdAt,
        updatedAt: restroomsTable.updatedAt,
      })
      .from(restroomsTable)
      .where(
        sql`ST_Intersects(
        location,
        ST_MakeEnvelope(${minLng}, ${minLat}, ${maxLng}, ${maxLat}, 32647)
      )`,
      );

    return result.map((r: any) => ({
      ...r,
      latitude: parseFloat(r.latitude),
      longitude: parseFloat(r.longitude),
    }));
  }

  async getRestroomById(id: string) {
    const result = await db
      .select({
        restroomId: restroomsTable.restroomId,
        name: restroomsTable.name,
        detail: restroomsTable.detail,
        address: restroomsTable.address,
        openingHours: restroomsTable.openingHours,
        closingHours: restroomsTable.closingHours,
        type: restroomsTable.type,
        isFree: restroomsTable.isFree,
        latitude: sql`ST_Y(location)`,
        longitude: sql`ST_X(location)`,
        createdBy: restroomsTable.createdBy,
        createdAt: restroomsTable.createdAt,
        updatedAt: restroomsTable.updatedAt,
      })
      .from(restroomsTable)
      .where(eq(restroomsTable.restroomId, id));

    if (result.length === 0) return null;

    const r = result[0] as any;
    return {
      ...r,
      latitude: parseFloat(r.latitude),
      longitude: parseFloat(r.longitude),
    };
  }

  async getRestroomByName(name: string) {
    const result = await db
      .select({
        restroomId: restroomsTable.restroomId,
        name: restroomsTable.name,
        detail: restroomsTable.detail,
        address: restroomsTable.address,
        openingHours: restroomsTable.openingHours,
        closingHours: restroomsTable.closingHours,
        type: restroomsTable.type,
        isFree: restroomsTable.isFree,
        latitude: sql`ST_Y(location)`,
        longitude: sql`ST_X(location)`,
        createdBy: restroomsTable.createdBy,
        createdAt: restroomsTable.createdAt,
        updatedAt: restroomsTable.updatedAt,
      })
      .from(restroomsTable)
      .where(eq(restroomsTable.name, name));

    if (result.length === 0) return null;

    const r = result[0] as any;
    return {
      ...r,
      latitude: parseFloat(r.latitude),
      longitude: parseFloat(r.longitude),
    };
  }

  async getRestroomCount() {
    const result = await db.$count(restroomsTable);
    return result;
  }

  // region create
  async createRestroom(input: CreateRestroomInput) {
    const existing = await this.getRestroomByName(input.name);
    if (existing) {
      throw new Error("Restroom with the same name already exists");
    }    
    
    await db.transaction(async (tx) => {
      await tx.insert(restroomsTable)
        .values({
          name: input.name,
          detail: input.detail,
          address: input.address,
          openingHours: input.openingHours,
          closingHours: input.closingHours,
          type: input.type,
          isFree: input.isFree,
          location: sql`ST_PointFromText(${"POINT(" + input.longitude + " " + input.latitude + ")"}, 32647)`,
          createdBy: input.createdBy,
        });
    });
    console.log(input.address)
    const created = await this.getRestroomByName(input.name);
    return created;
  }

  // region update
  async updateRestroom(id: string, input: UpdateRestroomInput) {
    const existing = await this.getRestroomById(id);
    if (!existing) {
      throw new Error("restroom not found");
    }

    await db.transaction(async (tx) => {
      await tx.update(restroomsTable)
        .set({
          name: input.name,
          detail: input.detail,
          address: input.address,
          openingHours: input.openingHours,
          closingHours: input.closingHours,
          type: input.type,
          isFree: input.isFree,
          location: sql`ST_PointFromText(${"POINT(" + input.longitude + " " + input.latitude + ")"}, 32647)`,
          updatedAt: new Date(),
        })
        .where(eq(restroomsTable.restroomId, id));
    });

    const updated = await this.getRestroomById(id);
    return updated;
  }

  // region delete
  async deleteRestroom(id: string) {
    const restroom = await this.getRestroomById(id);
    if (!restroom) {
      throw new Error("restroom not found");
    }

    await db.transaction(async (tx) => {
      await tx.delete(restroomsTable).where(eq(restroomsTable.restroomId, id));
    });
  }
}
