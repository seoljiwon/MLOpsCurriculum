FROM node:14-alpine

WORKDIR /usr/src/app

COPY *.json .
COPY *.lock .

RUN npm install

COPY . .

RUN npm build

EXPOSE 3000

CMD [ "npm", "run", "start" ] 

## builer
# FROM node:14-alpine AS builder

# WORKDIR /app
# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build

# # runner
# FROM node:14-alpine

# WORKDIR /app

# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/dist ./dist

# CMD ["npm", "run", "start:prod"]