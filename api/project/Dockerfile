# builer
FROM node:14-alpine AS builder

COPY . /app
WORKDIR /app

RUN npm install && npm run build

# runner
FROM node:14-alpine

WORKDIR /app

COPY --from=builder /app ./
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/dist ./dist

CMD ["npm", "run", "start"]
