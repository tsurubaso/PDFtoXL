import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const data = new Uint8Array(fs.readFileSync("./base.pdf"));

async function extractStructuredText() {
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;

  const allLines = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const items = content.items.map(item => ({
      str: item.str.trim(),
      x: item.transform[4],
      y: item.transform[5],
    }));

    // Grouper par Y avec tolérance
    const linesMap = new Map();
    const tolerance = 1.5;

    for (const item of items) {
      const yKey = [...linesMap.keys()].find(y => Math.abs(y - item.y) < tolerance);
      const key = yKey !== undefined ? yKey : item.y;

      if (!linesMap.has(key)) linesMap.set(key, []);
      linesMap.get(key).push(item);
    }

    // Trier les lignes par Y décroissant (du haut vers le bas)
    const sortedLines = [...linesMap.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([_, items]) =>
        items
          .sort((a, b) => a.x - b.x)
          .map(i => `"${i.str.replace(/"/g, '""')}"`)
          .join(",")
      );

    allLines.push(...sortedLines);
  }

  const csv = allLines.join("\n");
  fs.writeFileSync("output.csv", csv);
  console.log("✅ CSV généré : output.csv");
}

extractStructuredText();
