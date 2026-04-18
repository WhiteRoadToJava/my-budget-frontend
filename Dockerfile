FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Vite by default runs on 5173
EXPOSE 5173

# You MUST add --host to the command so it's accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]