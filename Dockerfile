# Use an official Node runtime as a parent image
FROM node:lts-bookworm

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Install Puppeteer dependencies
RUN apt-get update && \
    apt-get install -y wget gnupg ca-certificates libdrm2 libgbm1 \
    libx11-xcb1 libxcomposite1 libxdamage1 libxi6 libxext6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libasound2 libpangocairo-1.0-0 libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0 \
    fonts-liberation fonts-noto-cjk fonts-noto-color-emoji fonts-noto && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Bundle the source code inside the Docker image
COPY . .

# Make port available to the world outside this container
EXPOSE 3000

# Define environment variable for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Run the app when the container launches
CMD ["node", "index.js"]
