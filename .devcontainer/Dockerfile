FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bullseye

# Install system dependencies
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    git \
    build-essential \
    libfontconfig1 \
    libfreetype6 \
    libjpeg62-turbo \
    libpng16-16 \
    libx11-6 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

# Install Hugo
ARG HUGO_VERSION=0.148.2
RUN wget -q "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz" \
    && tar -xzf "hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz" \
    && mv hugo /usr/local/bin/ \
    && rm "hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz"

# Install global npm packages
RUN npm install -g \
    @playwright/test \
    eslint \
    prettier \
    typescript

# Set up workspace
WORKDIR /workspace

# Create cache directory
RUN mkdir -p /home/node/.npm

# Switch to node user
USER node

# Set up Git configuration
RUN git config --global init.defaultBranch main \
    && git config --global pull.rebase false

# Create helpful aliases
RUN echo 'alias hugo-dev="cd exampleSite && hugo server --buildDrafts --buildFuture --disableFastRender --bind 0.0.0.0"' >> ~/.bashrc \
    && echo 'alias test-visual="npm run test:visual"' >> ~/.bashrc \
    && echo 'alias test-e2e="npm run test:e2e"' >> ~/.bashrc \
    && echo 'alias dev="npm run start"' >> ~/.bashrc \
    && echo 'alias build="npm run build"' >> ~/.bashrc

# Expose ports
EXPOSE 1313 3000 3001 