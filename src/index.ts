import { Plugin, Loader } from "esbuild";
import path from "path";
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
        const variables = `
        const __fileloc = {
          filename: "${args.path}",
          dirname: "${path.dirname(args.path)}",
          relativefilename: "${path.relative(rootDir, args.path)}",
          relativedirname: "${path.relative(rootDir, path.dirname(args.path))}"
        };
      `;
        const fileContent = new TextDecoder().decode(
          await fs.readFile(args.path)
        );
        const globalsRegex = /__(?=(filename|dirname|relativefilename|relativedirname))/g;
        const contents =
          variables + "\n" + fileContent.replace(globalsRegex, "__fileloc.");
        const loader = args.path.split(".").pop() as Loader;

        return {
          contents,
          loader
        };
      }
    );
  }
});
