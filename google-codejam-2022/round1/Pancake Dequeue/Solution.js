"use strict";

// ===========================================================================
// ============================== process problems ===========================
// ===========================================================================

function solve(problem) {
  let count = 0;
  let d = -1;
  const h = problem.ds[0];
  const t = problem.ds[problem.ds.length - 1];
  if (h < t) {
    // get head
    d = h;
    problem.ds.shift();
    count++;
  } else {
    // get tail
    d = t;
    problem.ds.pop();
    count++;
  }

  for (;;) {
    if (problem.ds.length === 0) {
      return count;
    } else if (problem.ds.length === 1) {
      if (d <= problem.ds[0]) {
        count++;
      }
      return count;
    }
    const h = problem.ds[0];
    const t = problem.ds[problem.ds.length - 1];

    if (d > h && d > t) {
      return count; // finish
    }

    if (d > h) {
      // get tail
      d = t;
      problem.ds.pop();
      count++;
    } else if (d > t) {
      // get head
      d = h;
      problem.ds.shift();
      count++;
    } else {
      count++;
      if (h < t) {
        // get head
        d = h;
        problem.ds.shift();
      } else {
        // get tail
        d = t;
        problem.ds.pop();
      }
    }
  }
}

// ===========================================================================
// ============================== process input ==============================
// ===========================================================================
//
// processCases
//
function processCases(probs) {
  for (let index = 0; index < probs.length; index++) {
    const result = solve(probs[index]);
    let display = "";
    if (result) {
      display = `Case #${index + 1}: ${result}`;
      // for (let i = 0; i < result.length; i++) {
      //     display += result[i] + ' ';
      //     if (i != result.length - 1) {
      //         display += "\n";
      //     }
      // }
    }
    console.log(display);
  }
}

//
// CaseParser
//
class CaseParser {
  constructor() {
    this.n;
    this.ds = [];
  }

  readline(line) {
    const values = line.split(" ");
    if (!this.n) {
      this.n = parseInt(values[0]);
    } else {
      for (const v of values) {
        this.ds.push(parseInt(v));
      }
    }
  }

  isComplete() {
    return this.ds.length > 0;
  }

  getCase() {
    return {
      n: this.n,
      ds: this.ds,
    };
  }
}

//
// ProblemParser
//
class ProblemParser {
  constructor() {
    this.totalTetCases = undefined;
    this.t = 0;
    this.currentT = 0;
    this.cases = [];
    this.caseParser = new CaseParser();
    this.state = "t";
  }

  readline(line) {
    switch (this.state) {
      case "t": {
        this.t = parseInt(line);
        this.state = "case";
        break;
      }

      case "case": {
        this.caseParser.readline(line);

        if (this.caseParser.isComplete()) {
          this.cases.push(this.caseParser.getCase());
          this.currentT += 1;
          this.caseParser = new CaseParser();
        }

        break;
      }
    }

    if (this.currentT === this.t) {
      this.state = "done";
    }
  }

  isComplete() {
    return this.state === "done";
  }

  getCases() {
    return this.cases;
  }
}

function main() {
  const readline = require("readline");
  const problemParser = new ProblemParser();

  let rl;
  if (process.env.NODE_ENV === "local") {
    const fs = require("fs");
    rl = readline.createInterface({
      input: fs.createReadStream(`${__dirname}/in.txt`),
      output: process.stdout,
      console: false,
    });
  } else {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  rl.on("line", (line) => {
    problemParser.readline(line.trim());
    if (problemParser.isComplete()) {
      rl.close();
    }
  }).on("close", () => {
    processCases(problemParser.getCases());
  });
}

if (!module.parent) {
  main();
}

module.exports = solve;
