FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/seed.mjs ./seed.mjs
COPY --from=build /app/db ./db

RUN mkdir -p /app/db /app/dist/client/uploads && chown -R appuser:appgroup /app

ENV NODE_ENV=production
ENV UPLOADS_DIR=/app/dist/client/uploads
ENV PORT=3000

USER appuser

EXPOSE 3000

CMD ["sh", "-c", "node seed.mjs && node dist/server/entry.mjs"]
