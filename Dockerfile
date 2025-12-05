FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
# Copy the HTML files to nginx default directory
COPY . /usr/share/nginx/html/

# Copy nginx configuration (optional, uses default if not present)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
