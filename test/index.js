const { filelocPlugin } = require("../dist"),
  { assert } = require("chai"),
  { build } = require("esbuild");

describe("Fileloc esbuild tests", () => {
  it("Global variables work", (done) => {
    test("basic")
      .then((res) => {
        assert(res);
        done();
      })
      .catch(done);
  });
});

function test(test) {
  return build({
    entryPoints: [`tests/basic.ts`],
    bundle: true,
    outfile: `dist/${test}.js`,
    plugins: [filelocPlugin()]
  }).catch(() => process.exit(1));
}
