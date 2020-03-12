#!/usr/bin/env node
const c = require("ansi-colors");
const inquirer = require("inquirer");
const { execSync } = require("child_process");
const fs = require("fs");
const { resolve, parse } = require("path");

const USER_DIRECTORY = process.env.PWD ? process.env.PWD : process.cwd();
const PRIJECT_NAME = parse(USER_DIRECTORY).name
const TEMPLATE_DIRECTORY = resolve(__dirname, "template");
const QUESTIONS = [
    {
        type: "input",
        prefix:  c.greenBright(">"),
        default: "",
        message: "Enter description of your project:",
        name: "description",
    },
    {
        type: "input",
        prefix:  c.greenBright(">"),
        default: "",
        message: "What is your name?",
        name: "author",
    },
];

const resolveTemplate = (path) => resolve(TEMPLATE_DIRECTORY, path);
const resolveUser = (path) => resolve(USER_DIRECTORY, path);
const l = (message) => { console.log(message); };
const info = (message) => { l(c.bold("\n" + c.blue("i") + c.italic(` ${message}`))); }
const done = () => {l(c.greenBright("\u2713 Done")); };


function start() {
    l(
`
        ${c.blueBright("quick webpack start working")}
`
    )
}

async function question() {
    info("Details of your project");
    let answers = {};
    const details = await inquirer.prompt(QUESTIONS);
    answers = {answers, ...details};
    return answers;
}

function scaffold(answers) {
    info("downloading files ...");
    const packageJSON = require("./template/package.json");

    packageJSON.name = PRIJECT_NAME;
    packageJSON.description = answers.description;
    packageJSON.author = answers.author;

    const babel = fs.readFileSync(resolveTemplate("./.babelrc")).toString();
    const base = fs.readFileSync(resolveTemplate("./webpack.base.config.js")).toString();
    const dev = fs.readFileSync(resolveTemplate('./webpack.dev.config.js')).toString();
    const prod = fs.readFileSync(resolveTemplate('./webpack.prod.config.js')).toString();
    const openBrowser = fs.readFileSync(resolveTemplate('./openBrowser.js')).toString();


    try {
        fs.mkdirSync('webpackConfig')
        fs.mkdirSync('src')
    } catch {
        info('The webpackConfig and src dir has existed')
    }

    fs.writeFileSync(resolveUser('./src/index.js'), JSON.stringify())
    fs.writeFileSync(resolveUser("./package.json"), JSON.stringify(packageJSON, null, 2));
    fs.writeFileSync(resolveUser("./.babelrc"), babel);
    fs.writeFileSync(resolveUser("./webpackConfig/webpack.base.config.js"), base);
    fs.writeFileSync(resolveUser("./webpackConfig/webpack.dev.config.js"), dev);
    fs.writeFileSync(resolveUser("./webpackConfig/webpack.prod.config.js"), prod);
    fs.writeFileSync(resolveUser("./webpackConfig/openBrowser.js"), openBrowser);
    done();
}

function install() {
    info("Installing Dependencies");
    l(c.gray("  May take few minutes..."));
    try {
        execSync(`cd ${USER_DIRECTORY} && yarn install`);
    } catch (err) {
        execSync(`cd ${USER_DIRECTORY} && npm install`);
    }
    done();
}

function footer() {
    l(
`
    Your Project has created!
    - ${c.blue(`Learn how to config webpack:
      https://https://webpack.js.org/configuration/`)}
`)
}

(async() => {
    start();
    const answers = await question();
    scaffold(answers);
    install();
    footer();
})();