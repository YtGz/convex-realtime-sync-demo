import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  counters: defineTable({
    name: v.string(),
    value: v.number(),
    color: v.string()
  }),
  canvases: defineTable({
    strokes: v.array(
      v.object({
        points: v.array(v.object({ x: v.number(), y: v.number() })),
        color: v.string(),
        width: v.number()
      })
    ),
    updatedAt: v.number()
  })
});
