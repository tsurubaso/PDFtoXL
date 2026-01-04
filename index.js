import fs from "fs";
import { PDFParse } from "pdf-parse";

const dataBuffer = fs.readFileSync("./base.pdf");
const dataUint8 = new Uint8Array(dataBuffer); // Convert Buffer to Uint8Array

async function run() {
  const parser = new PDFParse(dataUint8);
  const result = await parser.getText();
  console.log(result.text);
  await parser.destroy();
}

run();
