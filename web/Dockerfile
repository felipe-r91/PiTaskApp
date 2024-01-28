# Use an official Node.js runtime as a parent image
FROM --platform=$BUILDPLATFORM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy the contents of the 'dist' folder to the working directory
COPY dist/ .

# Copy the entire 'node_modules' directory to the working directory
COPY node_modules/ .

# Expose the port that the app will run on
EXPOSE 5173

# Define the command to run your app
CMD ["npm", "start"]