# Use Node.js image
# FROM node:22

# # Create app directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package.json yarn.lock ./

# # Install app dependencies
# RUN yarn install

# # Copy app source code
# COPY . .

# # Set port env
# ENV PORT=3000

# # # Build Next.js app
# # RUN yarn build

# # Expose the app port
# EXPOSE 3000

# # State Next.js app
# CMD [ "yarn", "dev" ]



