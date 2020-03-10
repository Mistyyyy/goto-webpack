const c = require("ansi-colors");
const inquirer = require("inquirer");
const { execSync } = require("child_process");
const fs = require("fs");
const { resolve } = require("path");

const USER_DIRECTORY = process.env.PWD ? process.env.PWD : process.cwd();
const TEMPLATE_DIRECTORY = resolve(__dirname, "template/confg");
const QUESTIONS = [
    {
        type: "input",
        prefix: c.greenBright(">"),
        message: "What is name of your project?",
        name: "name",
        validate: (name) => {
            if (name === "") {
                return "Name cannot be left blank"
            }
            // Regular expression for valid npm package name
            if (!RegExp("^(?:@[a-z0-9-~][a-z0-9-._~]*/)?[a-z0-9-~][a-z0-9-._~]*$").test(name)){
                return "Invalid name"
            }
            return true;
        }
    },
    {
        type: "input",
        prefix:  c.greenBright(">"),
        message: "Enter description of your project:",
        name: "description",
    },
    {
        type: "input",
        prefix:  c.greenBright(">"),
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
        ------------------------
        Start your webpack scaffold on the go
`
    )
}

async function question() {
    info("Details of your scaffold");
    let answers = {};
    const details = await inquirer.prompt(QUESTIONS);
    answers = {answers, ...details};
    return answers;
}

function scaffold(answers) {
    info("Scaffolding files ...");
    const packageJSON = require("./template/config/package.json");

    packageJSON.name = `webpack-scaffold-${answers.name}`;
    packageJSON.description = answers.description;
    packageJSON.author = answers.author;

    const babel = fs.readFileSync(resolveTemplate("./.babelrc")).toString();
    const base = fs.readFileSync(resolveTemplate("./webpack.base.config.js")).toString();
    const dev = fs.readFileSync(resolveTemplate('./webpack.dev.config.js')).toString();
    const prod = fs.readFileSync(resolveTemplate('./webpack.prod.config.js')).toString();
    const openBrowser = fs.readFileSync(resolveTemplate('./webpack.dev.config.js')).toString();



    fs.writeFileSync(resolveUser("./package.json"), JSON.stringify(packageJSON, null, 2));
    fs.writeFileSync(resolveUser(".babelrc"), babel);
    fs.writeFileSync(resolveUser("./env/webpack.base.config.js"), base);
    fs.writeFileSync(resolveUser("./env/webpack.dev.config.js"), dev);
    fs.writeFileSync(resolveUser("./env/webpack.prod.config.js"), prod);
    fs.writeFileSync(resolveUser("./env/openBrowser.js"), openBrowser);
    done();
}

function install() {
    info("Installing Dependencies");
    l(c.gray("  May take few minutes..."));
    execSync(`cd ${USER_DIRECTORY} && npm install --quiet`);
    done();
}

function footer() {
    l(
`
    Your Project has created!
    - ${c.blue(`Learn how to config webpack:
      https://https://webpack.js.org/configuration/`)}
    - ${c.blue('For any help:')}
        * ${c.blue(`Create an issue:
          https://github.com/webpack/webpack`)}`
    )
}

(async() => {
    start();
    const answers = await question();
    scaffold(answers);
    install();
    footer();
})();