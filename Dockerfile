FROM node:20

WORKDIR /app

# Copia apenas package.json e package-lock.json primeiro
COPY package*.json ./
RUN npm install

# Copia a pasta src e outros arquivos necessários
COPY src ./src
COPY .env ./

EXPOSE 3000

CMD ["node", "src/server.js"]
