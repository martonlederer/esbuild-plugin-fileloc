const { build } = require("esbuild");

const formats = ["cjs", "esm"];

(async () => {
  for (const format of formats) {
    await build({
      entryPoints: ["./src/index.ts"],
      format,
      outfile: `./dist/index${format === "cjs" ? "" : "." + format}.js`
    });
  }
})();
