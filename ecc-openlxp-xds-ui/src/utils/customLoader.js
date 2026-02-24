export const myDefaultLoader = ({ config , src , width , quality  }) => {
    if (src.endsWith('.svg') && !config.dangerouslyAllowSVG) {
        // Special case to make svg serve as-is to avoid proxying
        // through the built-in Image Optimization API.
        return src;
    }
    return `${config.path}?url=${encodeURIComponent(src.replace("/ecc-openlxp-xds-ui", ""))}&w=${width}&q=${quality || 75}`;
}
