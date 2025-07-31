# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.15.0
ARG PNPM_VERSION=9.15.1

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production

RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION} tsx

# This is the working directory
WORKDIR /usr/src/app

# Copying package.json and pnpm-lock.yaml for dependency installation
COPY package.json pnpm-lock.yaml ./

# Temporarily set NODE_ENV to development to install devDependencies
ENV NODE_ENV development
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Restore NODE_ENV to production after dependencies are installed
ENV NODE_ENV production

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "pnpm tsc && pnpm drizzle-kit generate && pnpm drizzle-kit push && pnpm dev"]