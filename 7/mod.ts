import { _ } from "../deps.ts";

type Command = ChangeDir | List;

interface ChangeDir {
  name: "cd";
  payload: {
    dir: string;
  };
}

interface File {
  type: "file";
  name: string;
  size: number;
}

interface Directory {
  type: "dir";
  name: string;
}

interface List {
  name: "ls";
  payload: {
    result: (File | Directory)[];
  };
}

type Filesystem = Record<
  string,
  { contents: (File | Directory)[]; size: number }
>;

function parseFileOrDir(input: string): File | Directory | undefined {
  const dirMatch = input.match(/dir (.*)/);

  if (dirMatch) return { type: "dir", name: dirMatch[1] };

  const fileMatch = input.match(/([0-9]+) (.*)/);

  if (fileMatch)
    return { type: "file", name: fileMatch[2], size: Number(fileMatch[1]) };
}

function parseCommand(line: string): Command | undefined {
  if (!line) return;

  const tokens = _.trim(line).split("\n");

  const cdMatch = tokens[0].match(/cd (.*)/);

  if (cdMatch) return { name: "cd", payload: { dir: cdMatch[1] } };

  const lsMatch = tokens[0] === "ls";

  if (lsMatch)
    return {
      name: "ls",
      payload: { result: _.compact(tokens.slice(1).map(parseFileOrDir)) },
    };
}

function buildPath(tokens: string[]) {
  return tokens[0] + tokens.slice(1).join("/");
}

function buildFs(commands: Command[]) {
  const fs: Filesystem = {};
  const currentDir: string[] = [];
  const sizes: number[] = [];

  commands.forEach((command) => {
    if (command.name === "cd") {
      if (command.payload.dir === "..") currentDir.pop();
      else currentDir.push(command.payload.dir);

      return;
    }

    if (command.name === "ls") {
      const path = buildPath(currentDir);
      const size = _.sumBy(
        command.payload.result.filter((el) => el.type === "file"),
        "size"
      );

      fs[path] = {
        contents: command.payload.result,
        size,
      };

      // Update ancestor dir sizes
      for (let i = currentDir.length - 1; i > 0; i--) {
        const ancestorPath = buildPath(currentDir.slice(0, i));

        fs[ancestorPath] = {
          ...fs[ancestorPath],
          size: fs[ancestorPath].size + size,
        };
      }
    }
  });

  return fs;
}

const input = Deno.readTextFileSync("7/input");

const commands: Command[] = _.compact(input.split("$").map(parseCommand));
const fs = buildFs(commands);

const dirsWithSize = Object.entries(fs).map(([key, value]) => ({
  dir: key,
  size: value.size,
}));
const sumOfDirsAtMost100000 = _.sumBy(
  dirsWithSize.filter((dir) => dir.size <= 100_000),
  "size"
);

console.log(`Final result (part1): ${sumOfDirsAtMost100000}`);

// Get the total size of the fs
const diskUsed = fs["/"].size;
// Determine how much free space we have
const freeSpace = 70_000_000 - diskUsed;
// Infer the smallest possible dir size to reach 30_000_000 free space
const smallestDirToBeDeleted = 30_000_000 - freeSpace;

const dirsWithSizeClosestTo30000000 = _.orderBy(
  dirsWithSize.filter((dir) => dir.size >= smallestDirToBeDeleted),
  ["size", "asc"]
);

console.log(`Final result (part2): ${dirsWithSizeClosestTo30000000[0].size}`);
