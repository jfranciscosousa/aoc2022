import { _ } from "../deps.ts";

const input = Deno.readTextFileSync("1/input");

// Split into elfs then split the calories of each elf
const elfs = input.split("\n\n").map((e) => e.split("\n"));

console.log(`We have ${elfs.length} happy elves`);

const sumOfCaloriesForEachElf = elfs.map((calories) =>
  _.sum(calories.map((c) => Number(c)))
);
const elfWithMaxCalories = _.max(sumOfCaloriesForEachElf);

console.log(`The max amount of calories: ${elfWithMaxCalories} calories`);

const sortedCaloriesDesc = _.reverse(_.sortBy(sumOfCaloriesForEachElf));

console.log(
  `The sum of the top three amount of calories: ${_.sum(
    sortedCaloriesDesc.slice(0, 3)
  )} calories`
);
