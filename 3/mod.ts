import { _ } from "../deps.ts";

interface Rucksack {
  first: string;
  second: string;
}

interface RucksackWithCommonItem extends Rucksack {
  common: string;
  priority: number;
}

const input = Deno.readTextFileSync("3/input");
const rucksacks: Rucksack[] = _.compact(input.split("\n")).map((items) => {
  const half = items.length / 2;

  return { first: items.slice(0, half), second: items.slice(half) };
});

// Chat GPT FTW!
function findCommonCharacter(...strings: string[]): string | null {
  // Create a Set to store characters from the first string
  const characters = new Set(strings[0]);

  // Loop through each string (starting at the second string)
  for (const str of strings.slice(1)) {
    // Create a Set to store characters from the current string
    const strCharacters = new Set(str);

    // Loop through each character in the Set of characters from the first string
    for (const char of characters) {
      // If the character is not in the current string, remove it from the Set
      if (!strCharacters.has(char)) {
        characters.delete(char);
      }
    }

    // If the Set is empty, no common characters were found, so we return null
    if (characters.size === 0) {
      return null;
    }
  }

  // If the Set is not empty, some common characters were found, so we return the first common character from the Set
  return characters.values().next().value;
}

function isLowerCase(str: string) {
  return str.toLowerCase() === str;
}

function isUpperCase(str: string) {
  return str.toUpperCase() === str;
}

function calculatePriority(char: string) {
  const charCode = char.charCodeAt(0);

  if (!char.match(/[a-zA-Z]{1}/)) throw new Error("Invalid string!");

  if (isLowerCase(char)) {
    return charCode - "a".charCodeAt(0) + 1;
  }

  if (isUpperCase(char)) {
    return charCode - "A".charCodeAt(0) + 27;
  }

  throw new Error("Invalid string!");
}

const rucksacksWithCommonItems: RucksackWithCommonItem[] = _.compact(
  rucksacks.map((rucksack) => {
    const common = findCommonCharacter(rucksack.first, rucksack.second);

    if (!common) return;

    return {
      ...rucksack,
      common,
      priority: calculatePriority(common),
    };
  })
);
const sumOfPriorities = _.sumBy(rucksacksWithCommonItems, "priority");

console.log(`Result: ${sumOfPriorities}`);

// Part 2

interface ElfGroup {
  rucksacks: [string, string, string];
  common: string;
  priority: number;
}

function groupArray<T>(arr: T[]): T[][] {
  return arr.reduce((groups, item) => {
    const lastGroup = groups[groups.length - 1];

    if (!lastGroup || lastGroup.length === 3) {
      groups.push([item]);
    } else {
      lastGroup.push(item);
    }

    return groups;
  }, [] as T[][]);
}

const groups = groupArray(_.compact(input.split("\n")));
const elves: ElfGroup[] = _.compact(
  groups.map((rucksackGroups) => {
    const common = findCommonCharacter(...rucksackGroups);

    if (!common) return;

    return {
      rucksacks: rucksackGroups as [string, string, string],
      common,
      priority: calculatePriority(common),
    };
  })
);

const sumOfElfPriorities = _.sumBy(elves, "priority");

console.log(`Result (part 2): ${sumOfElfPriorities}`);
