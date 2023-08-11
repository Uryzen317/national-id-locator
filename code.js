const fs = require("fs");

let rawData = fs.readFileSync("./data.html").toString();
let rows = rawData.split("</tr>");
let data = [];

rows = rows.map((row) => {
  let code = row.split("<td>")[1]?.split("</td>")[0];
  let loc = row.split("<td>")[2]?.split("</td>")[0];

  if (!loc) return row;
  if (code === "***") return row;

  if (!code?.includes("-")) {
    // one code per row
    data.push({
      code: Number(code),
      loc,
    });
  } else {
    // multiple codes
    let codeBegin = Number(code.split("-")[0]);
    let codeEnd = Number(code.split("-")[1]);
    let deviation = codeEnd - codeBegin + 1; // include self

    for (let counter = 0; counter < deviation; counter++) {
      data.push({
        code: codeBegin + counter,
        loc,
      });
    }
  }

  return row;
});

fs.writeFileSync("./results.json", JSON.stringify(data, "\n", "\t"));
