import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('notes'),
      _creationTime: v.number(),
      content: v.string(),
      updatedAt: v.number()
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query('notes').collect();
  }
});

export const update = mutation({
  args: {
    id: v.id('notes'),
    content: v.string()
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      content: args.content,
      updatedAt: Date.now()
    });
    return null;
  }
});

export const create = mutation({
  args: {
    content: v.string()
  },
  returns: v.id('notes'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('notes', {
      content: args.content,
      updatedAt: Date.now()
    });
  }
});

export const remove = mutation({
  args: { id: v.id('notes') },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  }
});
