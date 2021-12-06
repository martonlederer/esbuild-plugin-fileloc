import { Plugin, Loader } from "esbuild";
import path from "path";
import process from "process";
import fs from "fs-extra";

interface FilelocPluginOptions {
  rootDir?: string;
}

export const filelocPlugin = (options?: FilelocPluginOptions): Plugin => ({
  name: "fileloc",
  setup(build) {
    const rootDir = options?.rootDir ?? process.cwd();

    build.onLoad(
      { filter: /.\.(js|ts|jsx|tsx)$/, namespace: "file" },
      async (args) => {
        const isWindows = /^win/.test(process.platform);
        const esc = p => isWindows ? p.replace(/\\/g, '/') : p;
        const variables = `
        const __fileloc = {
          filename: "${esc(args.path)}",
          dirname: "${esc(path.dirname(args.path))}",
          relativefilename: "${esc(path.relative(rootDir, args.path))}",
          relativedirname: "${esc(path.relative(rootDir, path.dirname(args.path)))}"
        };
        let __line = 0;
      `;
        const fileContent = new TextDecoder().decode(
          await fs.readFile(args.path)
        );

        const lines = fileContent.split("\n");
        let fileWithCharsAndLines = "";

        for (let i = 0; i < lines.length; i++) {
          const hasLineNumber = !!lines[i].match(/__line/g);
          fileWithCharsAndLines +=
            (hasLineNumber ? `__line=${i + 1};` : "") + lines[i] + "\n";
        }

        const globalsRegex = /__(?=(filename|dirname|relativefilename|relativedirname))/g;
        const contents =
          (fileWithCharsAndLines.match(globalsRegex) ? variables : "") +
          "\n" +
          fileWithCharsAndLines.replace(globalsRegex, "__fileloc.");
        const loader = args.path.split(".").pop() as Loader;

        return {
          contents,
          loader
        };
      }
    );
  }
});
