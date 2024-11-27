import DuwaEditor from "@/components/editor";
import React from "react";
import Script from "next/script";
import fs from "fs/promises";
import path from "path";
import { DuwaFile } from "@/types";
import { allGitReleaseInfos } from "contentlayer/generated";

async function readDuwaFiles(
  dirPath: string,
  basePath: string = ""
): Promise<DuwaFile[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files: DuwaFile[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.join(basePath, entry.name);

    if (entry.isDirectory()) {
      // Recursively read subdirectories
      const subDirFiles = await readDuwaFiles(fullPath, relativePath);
      files.push(...subDirFiles);
    } else if (entry.isFile() && path.extname(entry.name) === ".duwa") {
      // Read .duwa files
      const content = await fs.readFile(fullPath, "utf-8");

      // Generate name by removing extension
      const name = path
        .join(basePath, path.basename(entry.name, ".duwa"))
        .replace(/\\/g, "/");

      // Generate ID using the relative path (without extension)
      const id = path.join(basePath, entry.name).replace(/\\/g, "/");

      files.push({
        id,
        name,
        content,
      });
    }
  }

  return files;
}

async function fetchFiles() {
  try {
    const filesPath = path.join(
      process.cwd(),
      "public",
      "repo-content",
      "examples"
    );
    const duwaFiles = await readDuwaFiles(filesPath);

    return {
      files: duwaFiles,
    };
  } catch (error) {
    console.error("Error loading Duwa files:", error);
    return {
      files: [],
    };
  }
}

const Page = async () => {
  const data = await fetchFiles();
  const release = allGitReleaseInfos[0];

  return (
    <>
      <Script src="/wasm_exec.js" strategy="beforeInteractive" />
      <DuwaEditor sourceFiles={data.files} release={release} />
    </>
  );
};

export default Page;
