# Builds the static site with Gatsby, then serves it with nginx as a
# non-root user on port 8080.
#
# Demo content from kontent-backup.zip (default):
#   docker build -t kontent-lumen .
# Your own Kontent project (the project ID ends up in the image history,
# so never pass a preview key this way):
#   docker build -t kontent-lumen --build-arg KONTENT_OFFLINE= \
#     --build-arg KONTENT_PROJECT_ID=<project id> \
#     --build-arg KONTENT_LANGUAGE_CODENAMES=en-US,cs-CZ .

FROM node:22-bookworm AS build
WORKDIR /app
ENV GATSBY_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ARG KONTENT_OFFLINE=1
ARG KONTENT_PROJECT_ID
ARG KONTENT_LANGUAGE_CODENAMES
RUN npx gatsby build

FROM nginx:1.30-alpine
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build --chown=nginx:nginx /app/public /usr/share/nginx/html
USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
