FROM nginx:alpine
COPY ./FrontEnd/dist/agenda/ /usr/share/nginx/html
EXPOSE 80