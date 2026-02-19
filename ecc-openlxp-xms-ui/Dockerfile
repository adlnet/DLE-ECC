FROM registry1.dso.mil/ironbank/opensource/nodejs/nodejs18:18.20 AS builder
USER root

WORKDIR /app

COPY . .
COPY node_modules ./node_modules

RUN yarn build

USER node

# Production image, copy all the files and run next
FROM registry1.dso.mil/ironbank/opensource/nodejs/nodejs18:18.20 AS runner
USER root

WORKDIR /app

ENV NODE_ENV production
ENV NODE_OPTIONS="--max-old-space-size=500"

COPY --from=builder /app/src/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/.next/static/media /ecc-openlxp-xms-ui/.next/static/media/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN mkdir /app/.next/cache/images
RUN chmod 777 /app/.next/cache/images
RUN chown -R node:node /app/.next/cache/images
RUN sed -i 's/image?url=%2Fxms-ui/image?url=/g' /app/.next/server/pages/**/*.html
RUN sed -i 's/image?url=%2Fxms-ui/image?url=/g' /app/.next/server/pages/*.html
RUN sed -i 's/image?url=%2Fecc-openlxp-xms/image?url=/g' /app/.next/server/pages/**/*.html
RUN sed -i 's/image?url=%2Fecc-openlxp-xms/image?url=/g' /app/.next/server/pages/*.html
RUN sed -i 's+encodeURIComponent(n)+encodeURIComponent(n.replace("/xms-ui/", ""))+g' /app/.next/static/**/*.js

# #remove unnecessary files for twistlock scan
RUN rm -rf /app/node_modules/crypto2/test/units/*.pem. \
/app/node_modules/limes/test/shared/keys/*/*.pem. \
/app/node_modules/public-encrypt/test/*.priv \
/app/node_modules/public-encrypt/test/*.pem \
/app/node_modules/tailwind/test/shared/keys/*.pem \
/app/.yarn/cache/v6/*/node_modules/public-encrypt/test/*.priv \
/app/.yarn/cache/v6/*/node_modules/public-encrypt/test/*.pem \
/app/node_modules/public-encrypt/test/*.priv \
/app/node_modules/public-encrypt/test/*.pem \
/app/node_modules/tailwind/test/shared/keys/*.pem \
/app/node_modules/limes/test/shared/keys/*/*.pem \
/app/.yarn/cache/v6/*/node_modules/limes/test/shared/keys/*/*.pem \
/app/.yarn/cache/v6/*/node_modules/tailwind/test/shared/keys/*.pem \
/app/.yarn/cache/v6/*/node_modules/crypto2/test/units/*.pem \
/app/node_modules/crypto2/test/units/*.pem \
/app/node_modules/crypto2/test/units/privateKey.pem \
/app/node_modules/limes/test/shared/keys/auth.example.com/privateKey.pem \
/app/node_modules/limes/test/shared/keys/auth.intuity.de/privateKey.pem \
/app/node_modules/limes/test/shared/keys/auth.thenativeweb.io/privateKey.pem


#USER nextjs
USER node

EXPOSE 3000

ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start"]
