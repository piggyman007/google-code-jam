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

function rotLeft(a, d) {
    var arr = [];
    for (var i = 0; i < a.length; i++) {
        arr.push(a[i]);
    }
    for (var j = 1; j <= d; j++) {
        arr.shift(arr.push(arr[0]));
    }
    return arr;
}

function rotRight(a, d) {
    var arr = [...a];
    for (var j = 1; j <= d; j++) {
        const last = arr.pop();
        arr = [last, ...arr];
    }
    return arr;
}

function getAllPermutations(string) {
    var results = [];

    if (string.length === 1) {
        results.push(string);
        return results;
    }

    for (var i = 0; i < string.length; i++) {
        var firstChar = string[i];
        var charsLeft = string.substring(0, i) + string.substring(i + 1);
        var innerPermutations = getAllPermutations(charsLeft);
        for (var j = 0; j < innerPermutations.length; j++) {
            results.push(firstChar + innerPermutations[j]);
        }
    }
    return results;
}

function findAllMatrixFromBase(baseItems, bases, expectedTrace) {
    const rows = [];
    for (let i = 0; i < baseItems.length; i++) {
        rows.push(rotLeft(baseItems, i));
    }

    for (const base of bases) {
        const baseStringItems = base.split("");
        // get each matrix here
        const matrix = [];
        for (const stringItem of baseStringItems) {
            const idx = parseInt(stringItem);
            const rowString = rows[idx - 1];
            const rowInt = [];
            for (const rowStringItem of rowString) {
                rowInt.push(parseInt(rowStringItem));
            }
            matrix.push(rowInt);
        }

        // process each matrix
        // console.log(">>> ", JSON.stringify(matrix));
        const trace = getTrace(matrix);

        if (trace === expectedTrace) {
            return matrix;
        }
    }

    return false;
}

function findAllMatrixFromBase2(baseItems, bases, expectedTrace) {
    const rows = [];
    for (let i = 0; i < baseItems.length; i++) {
        rows.push(rotRight(baseItems, i));
    }

    for (const base of bases) {
        const baseStringItems = base.split("");
        // get each matrix here
        const matrix = [];
        for (const stringItem of baseStringItems) {
            const idx = parseInt(stringItem);
            const rowString = rows[idx - 1];
            const rowInt = [];
            for (const rowStringItem of rowString) {
                rowInt.push(parseInt(rowStringItem));
            }
            matrix.push(rowInt);
        }

        // process each matrix
        // console.log(">>> ", JSON.stringify(matrix));
        const trace = getTrace(matrix);

        if (trace === expectedTrace) {
            return matrix;
        }
    }

    return false;
}

function findMatrix(size, trace) {
    const row = [];
    for (let i = 1; i <= size; i++) {
        row.push(i);
    }

    const bases = getAllPermutations(row.join(""));
    for (const base of bases) {
        const baseItems = base.split("");

        const result = findAllMatrixFromBase(baseItems, bases, trace);
        if (result) {
            return result;
        }

        const result2 = findAllMatrixFromBase2(baseItems, bases, trace);
        if (result2) {
            return result2;
        }
    }

    return false;
}

function solve(problem) {
    const result = findMatrix(problem.items[0], problem.items[1]);
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
            display = `Case #${index + 1}: POSSIBLE\n`;
            for (let i = 0; i < result.length; i++) {
                display += result[i].join(" ");
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
        this.state;
    }

    readline(line) {
        const values = line.split(" ");
        const row = [];
        for (const val of values) {
            this.items.push(parseInt(val));
        }

        this.state = "done";
    }

    isComplete() {
        return this.state === "done";
    }

    getCase() {
        return {
            items: this.items,
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
