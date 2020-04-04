"use strict";

// ===========================================================================
// ============================== process problems ===========================
// ===========================================================================

class Person {
    constructor(name) {
        this.name = name;
        this.activities = [];
    }

    assign(start, end) {
        for (const activity of this.activities) {
            if (start >= activity.start && start < activity.end) {
                return false;
            }

            if (end > activity.start && end <= activity.end) {
                return false;
            }

            if (start < activity.start && end >= activity.end) {
                return false;
            }
        }
        this.activities.push({
            start,
            end,
        });

        return true;
    }
}

function sortItems(src) {
    let matrix = [...src];

    matrix = matrix.sort((a, b) => {
        if (a[0] > b[0]) {
            return 1;
        } else if (a[0] < b[0]) {
            return -1;
        } else {
            if (a[1] > b[1]) {
                return 1;
            }
            return -1;
        }
    });

    return matrix;
}

function solve(problem) {
    const c = new Person("C");
    const j = new Person("J");
    const assignees = [];

    const sortedMatrix = sortItems(problem.matrix);
    for (const activity of sortedMatrix) {
        const start = activity[0];
        const end = activity[1];

        if (c.assign(start, end)) {
            assignees.push(c.name);
        } else if (j.assign(start, end)) {
            assignees.push(j.name);
        } else {
            return "IMPOSSIBLE";
        }
    }

    // mapping sorted items with raw items
    let result = "";
    while (problem.matrix.length > 0) {
        const first = problem.matrix.shift();
        for (let i = 0; i < sortedMatrix.length; i++) {
            const sortItem = sortedMatrix[i];
            if (sortItem[0] === first[0] && sortItem[1] === first[1]) {
                // splice 1 item from assignees
                const assignee = assignees.splice(i, 1);
                result += assignee[0];

                // splice 1 item from sortedMatrix
                sortedMatrix.splice(i, 1);
                break;
            }
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
        if (this.matrix === undefined) {
            // first line of case
            this.size = parseInt(values[0]);
            this.matrix = [];
        } else {
            const row = [];
            for (const val of values) {
                if (val !== "") {
                    row.push(parseInt(val));
                }
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
