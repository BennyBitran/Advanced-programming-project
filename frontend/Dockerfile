FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

COPY . .

ENV PORT=3001
EXPOSE 3001

CMD ["npm", "start"]
