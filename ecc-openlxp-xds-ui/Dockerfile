FROM registry1.dso.mil/ironbank/opensource/nodejs/nodejs18:18.20 AS builder
USER root
WORKDIR /app
COPY . .
COPY node_modules ./node_modules
RUN yarn build
USER node

# Production image, copy all the files and run next
FROM registry1.dso.mil/ironbank/opensource/nodejs/nodejs18:18.20 AS runner
USER node

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/src/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/.next/static/media /ecc-openlxp-xds-ui/.next/static/media/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
USER root
RUN mkdir /app/.next/cache/images
RUN chmod 777 /app/.next/cache/images
RUN chown -R node:node /app/.next/cache/images
RUN sed -i 's/image?url=%2Fecc-openlxp-xds-ui/image?url=/g' /app/.next/server/pages/**/*.html
RUN sed -i 's/image?url=%2Fecc-openlxp-xds-ui/image?url=/g' /app/.next/server/pages/*.html
RUN sed -i 's+encodeURIComponent(n)+encodeURIComponent(n.replace("/ecc-openlxp-xds-ui", ""))+g' /app/.next/static/**/*.js


#USER nextjs
USER node

EXPOSE 3000

ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start"]
