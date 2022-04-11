"use strict";

// ===========================================================================
// ============================== process problems ===========================
// ===========================================================================

function findMinAmount(p1, p2, p3) {
    let min = p1
    if (p2 < min) {
        min = p2
    }
    if (p3 < min) {
        min = p3
    }
    return min
}

function solve(problem) {
    const totalAmount = 1000000
    const minC = findMinAmount(problem.items[0][0], problem.items[1][0], problem.items[2][0])
    const minY = findMinAmount(problem.items[0][1], problem.items[1][1], problem.items[2][1])
    const minM = findMinAmount(problem.items[0][2], problem.items[1][2], problem.items[2][2])
    const minK = findMinAmount(problem.items[0][3], problem.items[1][3], problem.items[2][3])

    if (minC + minY + minM + minK < totalAmount) {
        return null
    }

    const usedInks = [minC]
    let totalUsedInk = minC
    let remainingInkRequired = totalAmount - totalUsedInk

    if (remainingInkRequired === 0) {
        usedInks.push(0)
        usedInks.push(0)
        usedInks.push(0)
        return usedInks
    }

    if (minY >= remainingInkRequired) {
        usedInks.push(remainingInkRequired)
        usedInks.push(0)
        usedInks.push(0)
        return usedInks
    } else {
        usedInks.push(minY)
        remainingInkRequired -= minY
    }

    if (minM >= remainingInkRequired) {
        usedInks.push(remainingInkRequired)
        usedInks.push(0)
        return usedInks
    } else {
        usedInks.push(minM)
        remainingInkRequired -= minM
    }

    if (minK >= remainingInkRequired) {
        usedInks.push(remainingInkRequired)
        return usedInks
    } else {
        usedInks.push(minK)
        remainingInkRequired -= minK
    }

    return usedInks
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
            display = `Case #${index + 1}: ${result.join(' ')}`
            // for (let i = 0; i < result.length; i++) {
            //     display += result[i] + ' ';
            //     if (i != result.length - 1) {
            //         display += "\n";
            //     }
            // }
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
        this.size = 3;
        this.items = [];
        this.state;
    }

    readline(line) {
        const values = line.split(" ")
        const rows = []
        for (const val of values) {
            rows.push(parseInt(val))
        }
        this.items.push(rows)
    }

    isComplete() {
        return this.size === this.items.length;
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
