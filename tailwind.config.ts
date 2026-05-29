import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { ink:"#0E1726", navy:"#13293D", gold:"#C99A2E", goldl:"#E3C77A", teal:"#176B82", ivory:"#FBF9F4", cream:"#F1EBE0" },
    fontFamily: { serif:["'Cormorant Garamond'","serif"], sans:["'Jost'","sans-serif"] },
  } },
  plugins: [],
};
export default config;
