import { _ } from "../deps.ts";

const input = Deno.readTextFileSync("5/input");
const lines = input.split("\n");

function transposeMatrix(matrix: string[][]) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const transposed: string[][] = [];

  // Create a new empty matrix with the same number of columns as the original
  // matrix has rows, and the same number of rows as the original matrix has
  // columns.
  for (let i = 0; i < cols; i++) {
    transposed.push([]);
  }

  // Iterate over the original matrix and for each element, add it to the
  // corresponding position in the new matrix.
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      transposed[j][i] = matrix[i][j];
    }
  }

  return transposed;
}

function splitEvery4(string: string) {
  const result = [];
  for (let i = 0; i < string.length; i += 4) {
    result.push(string.substring(i, i + 4));
  }
  return result;
}

function extractMoves(move: string) {
  const regex = /move (\d+) from (\d+) to (\d+)/;
  const result = regex.exec(move);

  if (!result) throw new Error("Invalid move");

  return {
    amount: Number(result[1]),
    from: Number(result[2]) - 1,
    to: Number(result[3]) - 1,
  };
}

function extractCratesAndMoves(lines: string[]) {
  const unparsedCrates: string[] = [];
  const unparsedMoves: string[] = [];
  let parsingCrates = true;

  lines.forEach((line) => {
    if (!line) return;

    if (line.match(/^[0-9 ]+$/)) {
      parsingCrates = false;
      return;
    }

    if (parsingCrates) {
      unparsedCrates.push(line);
    } else {
      unparsedMoves.push(line);
    }
  });

  // Pad the crates array
  const maxCrateSize = _.max(unparsedCrates.map((c) => c.length));
  const crates = transposeMatrix(
    unparsedCrates.map((c) => splitEvery4(_.padEnd(c, maxCrateSize, " ")))
  )
    .map((cratesGroup) => cratesGroup.map(_.trim).filter((crate) => !!crate))
    .map(_.reverse);
  // Parse the moves
  const moves = unparsedMoves.map(extractMoves);

  return { crates, moves };
}

function take<T>(arr: T[], itemsToTake: number) {
  const last = arr.slice(-itemsToTake);
  const remaining = arr.slice(0, -itemsToTake);
  return { last, remaining };
}

function crateMover({ reverse = true } = {}) {
  const { crates, moves } = extractCratesAndMoves(lines);

  moves.forEach(({ amount, from, to }) => {
    const fromCrateStack = crates[from];
    const toCrateStack = crates[to];

    const { remaining: newFromCrateStack, last: itemsToAdd } = take(
      fromCrateStack,
      amount
    );
    // Reverse the items because they are added one at a time, from the top most to the bottom most of the original stack
    const newToCrateStack = toCrateStack.concat(
      reverse ? itemsToAdd.reverse() : itemsToAdd
    );

    // Update arrays
    crates[from] = newFromCrateStack;
    crates[to] = newToCrateStack;
  });

  const cratesOnTop = crates
    .map(_.last)
    .map((crate) => _.trim(crate, "[]"))
    .join("");

  return cratesOnTop;
}

console.log(`Final result (part1): ${crateMover({ reverse: true })}`);
console.log(`Final result (part2): ${crateMover({ reverse: false })}`);
