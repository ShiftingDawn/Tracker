import { readFile as readFileFromDisk, writeFile as writeFileToDisk } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export function getFilePath(uuid: string) {
  const root = process.env.FILE_ROOT ?? join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "storage");
  return join(root, uuid);
}

export async function writeFile(uuid: string, data: Buffer) {
  await writeFileToDisk(getFilePath(uuid), data);
}

export async function readFile(uuid: string) {
  return await readFileFromDisk(getFilePath(uuid));
}
