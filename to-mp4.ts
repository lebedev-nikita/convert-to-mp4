#!/usr/bin/env -S deno run -A

import { $ } from "npm:zx@8.0.2";
import { extname } from "jsr:@std/path@0.225.0";

const inputFile = Deno.args[0];

if (!inputFile) {
  throw new Error("Input file not specified (first argument)");
}

const inputExt = extname(inputFile);

if (!inputExt) {
  throw new Error(`file has no extension: '${inputFile}'`);
}

const outputFile = inputFile.slice(0, -inputExt.length) + ".mp4";

switch (inputExt) {
  case ".mp4":
    throw new Error("Input file is already .mp4");

  case ".wmv":
    await $`ffmpeg -i ${inputFile} -c:v libx264 -crf 23 -c:a aac -q:a 100 ${outputFile}`;
    break;

  case ".webm":
    // 1 - it works, but takes too much time
    // await $`ffmpeg -fflags +genpts -r 24 -i ${inputFile} ${outputFile}`;
    // 2 - fast, but result cannot be opened in QuickTime Player
    await $`ffmpeg -i ${inputFile} -c copy ${outputFile}`;
    break;

  case ".mkv":
    await $`ffmpeg -i ${inputFile} -c copy ${outputFile}`;
    break;

  default:
    throw new Error(`unexpected extension: ${inputExt}`);
}
