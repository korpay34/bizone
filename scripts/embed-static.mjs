import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourceRoot = join(root, "static-src");
const files = {};

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) await walk(fullPath);
    else {
      const key = "/" + relative(sourceRoot, fullPath).replaceAll("\\", "/");
      const binary = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico"].includes(extname(fullPath).toLowerCase());
      files[key] = binary
        ? { encoding: "base64", body: (await readFile(fullPath)).toString("base64") }
        : { encoding: "utf8", body: await readFile(fullPath, "utf8") };
    }
  }
}

await walk(sourceRoot);
const worker = await readFile(join(root, "worker/index.js"), "utf8");
const output = worker.replace("__STATIC_FILES__", JSON.stringify(files));
await mkdir(join(root, "dist"), { recursive: true });
await writeFile(join(root, "dist/worker.js"), output);
