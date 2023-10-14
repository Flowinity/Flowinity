import resolveConfig from "tailwindcss/resolveConfig";
//@ts-ignore
import * as tailwindConfig from "../../tailwind.config.js";
const fullConfig = resolveConfig(tailwindConfig.default);

export default fullConfig.theme;
