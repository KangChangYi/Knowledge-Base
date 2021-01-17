FROM nginx:alpine
COPY nginx.conf /etc/nginx
COPY ./docs/.vuepress/dist/ /usr/share/nginx/html/
EXPOSE 80