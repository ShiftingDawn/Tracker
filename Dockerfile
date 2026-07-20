FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ENV IS_BUILD_ENV=true
RUN bun run build
RUN bun install --frozen-lockfile --production

FROM oven/bun:1

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

ENV DATABASE_URL=postgres://root:mysecretpassword@localhost:5432/local
ENV REDIS_URL=redis://192.168.1.2:6379/1

ENV PORT=3000
ENV ORIGIN=http://localhost:$PORT/

EXPOSE $PORT

CMD ["bun", "run", "prod"]