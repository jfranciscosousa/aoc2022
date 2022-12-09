import { _ } from "../deps.ts";

const input = Deno.readTextFileSync("4/input");
const assignmentPairs = _.compact(input.split("\n")).map((unparsedPair) => {
  const [range1, range2] = unparsedPair.split(",");
  const [min1, max1] = range1.split("-").map((n) => Number(n));
  const [min2, max2] = range2.split("-").map((n) => Number(n));

  return {
    range1: [min1, max1] as [number, number],
    range2: [min2, max2] as [number, number],
  };
});

// ChatGPT ftw!
function rangeContained(
  range1: [number, number],
  range2: [number, number]
): boolean {
  // Get the minimum and maximum values for each range
  const [min1, max1] = range1;
  const [min2, max2] = range2;

  // Check if one range is completely contained within the other
  return (min1 <= min2 && max1 >= max2) || (min1 >= min2 && max1 <= max2);
}

// ChatGPT ftw!
function rangeOverlap(
  range1: [number, number],
  range2: [number, number]
): boolean {
  // Check if the start of range1 is within range2
  const startInRange2 = range1[0] >= range2[0] && range1[0] <= range2[1];

  // Check if the end of range1 is within range2
  const endInRange2 = range1[1] >= range2[0] && range1[1] <= range2[1];

  // Check if range1 completely contains range2
  const range1ContainsRange2 = range1[0] <= range2[0] && range1[1] >= range2[1];

  // If any of the above conditions are true, then the ranges overlap
  return startInRange2 || endInRange2 || range1ContainsRange2;
}

const assignmentPairsWithContainment = assignmentPairs.filter((pair) =>
  rangeContained(pair.range1, pair.range2)
);

console.log(`Result (part 1): ${assignmentPairsWithContainment.length}`);

const assignmentPairsWithOverlap = assignmentPairs.filter((pair) =>
  rangeOverlap(pair.range1, pair.range2)
);

console.log(`Result (part 2): ${assignmentPairsWithOverlap.length}`);
