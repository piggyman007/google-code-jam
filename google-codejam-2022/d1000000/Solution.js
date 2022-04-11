"use strict";

// ===========================================================================
// ============================== process problems ===========================
// ===========================================================================



function solve(problem) {
    let result = 0
    const items = problem.items
    items.sort(function(a, b){return a - b})

    let num = 1
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item >= num) {
            // valid
            result++
            num++
        }
    }

    return result;
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
            display = `Case #${index + 1}: ${result}\n`;
        } else {
            display = `Case #${index + 1}: IMPOSSIBLE`;
        }
        console.log(display);
    }
}

//
// CaseParser
//
class CaseParser {
    constructor() {
        this.items = []
        this.state
        this.total
    }

    readline(line) {
        if (this.total === undefined) {
            this.total = parseInt(line)
        } else {
            const values = line.split(" ")
            for (const val of values) {
                this.items.push(parseInt(val))
            }
            this.state = "done"
        }
    }

    isComplete() {
        return this.state === "done";
    }

    getCase() {
        return {
            items: this.items
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
