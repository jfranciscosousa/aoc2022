import { _ } from "../deps.ts";

const input = Deno.readTextFileSync("6/input");

// Returns how many characters it had to loop through until finding a sequence of N unique numbers
function transmissionParser(transmission: string, uniqueNumbers: number) {
  const chars = Array.from(transmission);
  let charactersProcessed = 0;

  chars.some((_char, index) => {
    charactersProcessed += 1;

    const group = _.compact(
      _.range(index, index + uniqueNumbers).map((i) => chars[i])
    );

    if (group.length !== uniqueNumbers) return;

    const areAllCharsUniq = new Set(group).size === group.length;

    if (areAllCharsUniq) {
      // Add the characters from this group
      charactersProcessed += group.length - 1;

      return true;
    }
  });

  return charactersProcessed;
}

console.log(input.length);
console.log(`Final result (part1): ${transmissionParser(input, 4)}`);
console.log(`Final result (part2): ${transmissionParser(input, 14)}`);
