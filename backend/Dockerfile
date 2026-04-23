# ─── Stage 1 : dépendances ───────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# ─── Stage 2 : tests ─────────────────────────────────────────────────────────
FROM node:20-alpine AS test

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src ./src
RUN npm test

# ─── Stage 3 : production ────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Copie uniquement les deps de production depuis stage 1
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src

# Utilisateur non-root pour la sécurité
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "src/index.js"]