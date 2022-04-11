"use strict";

// ===========================================================================
// ============================== process problems ===========================
// ===========================================================================

function renderBorderTopRow(c, isFirstRow) {
    const result = []
    const totalDot = (c * 2) + 1
    for (let i = totalDot; i > 0; i--) {
        if (isFirstRow && (i === totalDot || i === totalDot - 1)) {
            result.push('.')
        } else if (i % 2 == 0) {
            result.push('-')
        } else {
            result.push('+')
        }
    }
    return result
}

function renderBorderBottomRow(c, isFirstRow) {
    const result = []
    const totalDot = (c * 2) + 1
    for (let i = totalDot; i > 0; i--) {
        if (i % 2 == 0) {
            result.push('-')
        } else {
            result.push('+')
        }
    }
    return result
}

function renderDataRow(c, isFirstRow) {
    const result = []
    const totalDot = (c * 2) + 1
    for (let i = totalDot; i > 0; i--) {
        if (isFirstRow && (i === totalDot || i === totalDot - 1)) {
            result.push('.')
        } else if (i % 2 == 0) {
            result.push('.')
        } else {
            result.push('|')
        }
    }
    return result
}

function shouldRenderTopBorderRow(currentRow) {
    return currentRow === 0
}

function solve(problem) {
    const result = []
    for (let i = problem.r; i > 0; i--) {
        if (shouldRenderTopBorderRow(problem.r - i)) {
            const topBorderRow = renderBorderTopRow(problem.c, i === problem.r)
            result.push(topBorderRow)
        }

        const dataRow = renderDataRow(problem.c, i === problem.r)
        result.push(dataRow)

        const bottomBorderRow = renderBorderBottomRow(problem.c, i === problem.r)
        result.push(bottomBorderRow) 
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
            display = `Case #${index + 1}:\n`;
            for (let i = 0; i < result.length; i++) {
                display += result[i].join("");
                if (i != result.length - 1) {
                    display += "\n";
                }
            }
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
        this.size;
        this.items = [];
        this.r;
        this.c;
        this.state;
    }

    readline(line) {
        const values = line.split(" ");
        this.r = parseInt(values[0])
        this.c = parseInt(values[1])

        this.state = "done";
    }

    isComplete() {
        return this.state === "done";
    }

    getCase() {
        return {
            r: this.r,
            c: this.c
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
