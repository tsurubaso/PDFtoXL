import fs from "fs";

const input = fs.readFileSync("output.csv", "utf8")
  .split("\n")
  .map(line => line.replace(/^"",/, ""))   // supprime "" au début
  .join("\n");

fs.writeFileSync("output2.csv", input, "utf8");
