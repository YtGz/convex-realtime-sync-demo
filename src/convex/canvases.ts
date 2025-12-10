import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

const strokeValidator = v.object({
  points: v.array(v.object({ x: v.number(), y: v.number() })),
  color: v.string(),
  width: v.number()
});

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('canvases'),
      _creationTime: v.number(),
      strokes: v.array(strokeValidator),
      updatedAt: v.number()
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query('canvases').collect();
  }
});

export const create = mutation({
  args: {},
  returns: v.id('canvases'),
  handler: async (ctx) => {
    return await ctx.db.insert('canvases', {
      strokes: [],
      updatedAt: Date.now()
    });
  }
});

export const addStroke = mutation({
  args: {
    id: v.id('canvases'),
    stroke: strokeValidator
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const canvas = await ctx.db.get(args.id);
    if (!canvas) return null;

    await ctx.db.patch(args.id, {
      strokes: [...canvas.strokes, args.stroke],
      updatedAt: Date.now()
    });
    return null;
  }
});

export const clear = mutation({
  args: { id: v.id('canvases') },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      strokes: [],
      updatedAt: Date.now()
    });
    return null;
  }
});

export const remove = mutation({
  args: { id: v.id('canvases') },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  }
});
