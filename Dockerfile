# Use Bun Alpine image for the builder stage
FROM oven/bun:1-alpine AS builder
WORKDIR /app
ARG PUBLIC_CONVEX_URL
ENV PUBLIC_CONVEX_URL=$PUBLIC_CONVEX_URL
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Use Bun Alpine image for the final stage
FROM oven/bun:1-alpine
WORKDIR /app
COPY --from=builder /app/build ./
EXPOSE 3000
ENV NODE_ENV=production
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
CMD [ "bun", "./index.js" ]
