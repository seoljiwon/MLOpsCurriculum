FROM node:14 AS builder

COPY . /app
WORKDIR /app

RUN npm install
RUN npm run build

FROM node:14-alpine

WORKDIR /app

COPY --from=builder /app ./

CMD ["npm", "run", "start"]