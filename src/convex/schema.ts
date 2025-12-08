import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  counters: defineTable({
    name: v.string(),
    value: v.number(),
    color: v.string()
  }),
  notes: defineTable({
    content: v.string(),
    updatedAt: v.number()
  })
});
