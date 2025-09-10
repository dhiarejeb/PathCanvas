#install node js in order to have npm installation commend
#intall dependencies with npm
#copy files and run app
# Build Angular app
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm install -g @angular/cli
RUN npm install
RUN ng build --configuration production

#we need to use server to run angular apps ngnx
#open source web server (api online)
# Serve with Nginx
FROM nginx:1.27-alpine
COPY --from=builder /app/dist/path-canvas /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
