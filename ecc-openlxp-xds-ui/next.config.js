const { createSecureHeaders } = require("next-secure-headers");

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // basePath: '/ecc-openlxp-xds-ui',

    // Adding policies:
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: createSecureHeaders({
                    contentSecurityPolicy: {
                        directives: {
                            defaultSrc: [
                                "'self'",
                                "https://ecc.staging.dso.mil",
                                "https://ecc.staging.dso.mil/ecc-openlxp-xds/",
                                "https://ecc.apps.dso.mil",
                                "https://ecc.apps.dso.mil/ecc-openlxp-xds-ui/"
                            ],
                            styleSrc: [
                                "'self'",
                                "https://ecc.apps.dso.mil",
                                "https://ecc.apps.dso.mil/ecc-openlxp-xds-ui/",
                                "https://ecc.staging.dso.mil", 
                                "https://fonts.googleapis.com"
                            ],
                            imgSrc: ["'self'",
                                    "data:",
                                    "data:*",
                                    "https://www.jcs.mil",
                                    "https://www.aetc.af.mil",
                                    "https://prod-discovery.edx-cdn.org",
                                    "https://media.defense.gov",
                                    "https://www.dote.osd.mil",
                                    "https://d15cw65ipctsrr.cloudfront.net",
                                    "https://d3njjcbhbojbot.cloudfront.net",
                                    "https://coursera-course-photos.s3.amazonaws.com",
                                    "https://ecc.apps.dso.mil"
                            ],
                            fontSrc: [
                                "'self'", 
                                "https://fonts.gstatic.com"
                            ],
                            frameAncestors: [
                                "'self'",
                                "https://ecc.staging.dso.mil",
                                "https://ecc.apps.dso.mil",
                                "https://ecc.apps.dso.mil/ecc-openlxp-xms-ui/"
                            ]
                        },
                        frameGuard: "deny",
                        noopen: "noopen",
                        nosniff: "nosniff",
                        xssProtection: "sanitize",
                        referrerPolicy: "origin-when-cross-origin",
                    }
                })
            },
        ];
    },
}

module.exports = nextConfig