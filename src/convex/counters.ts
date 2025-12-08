import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('counters'),
      _creationTime: v.number(),
      name: v.string(),
      value: v.number(),
      color: v.string()
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query('counters').collect();
  }
});

export const increment = mutation({
  args: { id: v.id('counters') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const counter = await ctx.db.get(args.id);
    if (counter) {
      await ctx.db.patch(args.id, { value: counter.value + 1 });
    }
    return null;
  }
});

export const decrement = mutation({
  args: { id: v.id('counters') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const counter = await ctx.db.get(args.id);
    if (counter) {
      await ctx.db.patch(args.id, { value: counter.value - 1 });
    }
    return null;
  }
});

export const create = mutation({
  args: {
    name: v.string(),
    color: v.string()
  },
  returns: v.id('counters'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('counters', {
      name: args.name,
      value: 0,
      color: args.color
    });
  }
});

export const reset = mutation({
  args: { id: v.id('counters') },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { value: 0 });
    return null;
  }
});
