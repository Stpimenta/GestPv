# build
FROM node:20-alpine AS build

# Define a variável de build
ARG VITE_IBPV_API_URL
ENV VITE_IBPV_API_URL=$VITE_IBPV_API_URL

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Build do Vite vai usar VITE_IBPV_API_URL
RUN npm run build

# runtime
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia o
