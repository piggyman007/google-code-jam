"use strict";

// ===========================================================================
// ============================== process problems ===========================
// ===========================================================================

function getTrace(matrix) {
    let trace = 0;
    for (let i = 0; i < matrix.length; i++) {
        trace += matrix[i][i];
    }
    return trace;
}

function isRepeated(src) {
    const items = [...src];
    const sortedItems = items.sort();
    if (sortedItems.length <= 1) {
        return false;
    }
    for (let i = 0; i < sortedItems.length - 1; i++) {
        if (sortedItems[i] === sortedItems[i + 1]) {
            return true;
        }
    }
    return false;
}

function findNoOfRepeatingColumn(matrix) {
    let noOfRepeating = 0;
    for (let i = 0; i < matrix.length; i++) {
        const column = [];
        for (let j = 0; j < matrix.length; j++) {
            column.push(matrix[j][i]);
        }
        if (isRepeated(column)) {
            noOfRepeating++;
        }
    }

    return noOfRepeating;
}

function findNoOfRepeatingRow(matrix) {
    let noOfRepeating = 0;
    for (const row of matrix) {
        if (isRepeated(row)) {
            noOfRepeating++;
        }
    }

    return noOfRepeating;
}

function solve(problem) {
    const trace = getTrace(problem.matrix);
    const noOfRepeatingRow = findNoOfRepeatingRow(problem.matrix);
    const noOfRepeatingColumn = findNoOfRepeatingColumn(problem.matrix);

    return `${trace} ${noOfRepeatingRow} ${noOfRepeatingColumn}`;
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
        console.log(`Case #${index + 1}: ${result}`);
    }
}

//
// CaseParser
//
class CaseParser {
    constructor() {
        this.size;
        this.matrix;
        this.state;
    }

    readline(line) {
        const values = line.split(" ");
        if (this.size === undefined) {
            // first line of case
            this.size = parseInt(values[0]);
            this.matrix = [];
        } else {
            const row = [];
            for (const val of values) {
                row.push(parseInt(val));
            }
            this.matrix.push(row); // add a row

            if (this.matrix.length === this.size) {
                this.state = "done";
            }
        }
    }

    isComplete() {
        return this.state === "done";
    }

    getCase() {
        return {
            matrix: this.matrix,
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
