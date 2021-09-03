# pull nginx image
FROM harbor.wistron.com/base_image/nginx:latest
# FROM harbor.wistron.com/base_image/alpine:3.10
# RUN app nginx


ENV http_proxy=
ENV https_proxy=


# Move all file to /app directory
ADD . /app/

# Set working directory to /app
WORKDIR /app

# Copy Angular output into nginx html
COPY ./dist /usr/share/nginx/html

# Copy nginx Configs
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf