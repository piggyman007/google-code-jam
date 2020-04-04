"use strict";

// ===========================================================================
// ============================== process problems ===========================
// ===========================================================================

function wrapParentheses(num) {
    let opening = "";
    let closing = "";
    for (let i = 0; i < num; i++) {
        opening += "(";
        closing += ")";
    }
    return `${opening}${num}${closing}`;
}

function solve(problem) {
    let output = "";
    for (let i = 0; i < problem.inputs.length; i++) {
        output += wrapParentheses(problem.inputs[i]);
    }

    // for (const key in queue) {
    //     const num = parseInt(key.replace("key_", ""));
    //     output += wrapParentheses(num, queue[key]);
    // }

    // output += wrapParentheses(item);
    for (let i = 0; i < problem.inputs.length * 1000; i++) {
        output = output.replace(/\)\(/g, "");
    }
    return output;
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
        this.inputs;
        this.state;
    }

    readline(line) {
        const values = line.split("");
        const inputs = [];
        for (const val of values) {
            inputs.push(parseInt(val));
        }

        this.inputs = inputs;
        this.state = "done";
    }

    isComplete() {
        return this.state === "done";
    }

    getCase() {
        return {
            inputs: this.inputs,
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
