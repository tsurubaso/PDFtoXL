import fs from "fs";
import { PDFParse } from "pdf-parse";

const dataBuffer = fs.readFileSync("./base.pdf");
const dataUint8 = new Uint8Array(dataBuffer);

async function run() {
  const parser = new PDFParse(dataUint8);
  const result = await parser.getText();
  await parser.destroy();

  // Supposons que chaque ligne du tableau est sur une ligne du texte
  const lines = result.text.split("\n").map(line => line.trim()).filter(Boolean);

  // On suppose que les colonnes sont séparées par des espaces ou tabulations
  const csvLines = lines.map(line => {
    const columns = line.split(/\s{2,}|\t+/); // Sépare par 2+ espaces ou tabulations
    return columns.map(col => `"${col.replace(/"/g, '""')}"`).join(",");
  });

  const csvContent = csvLines.join("\n");
  fs.writeFileSync("output.csv", csvContent);
  console.log("CSV généré : output.csv");
}

run();
