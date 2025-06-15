/** @type {import("prettier").Config} */
export default {
  semi: false,
  singleQuote: false,
  bracketSameLine: true,
  trailingComma: "es5",
  printWidth: 100,
  quoteProps: "consistent",
  endOfLine: "lf",
  plugins: ["prettier-plugin-tailwindcss"],
}
