#!/usr/bin/env node

const c = require("ansi-colors");
const inquirer = require("inquirer");
const { execSync } = require("child_process");
const fs = require("fs");
const { resolve, parse, join } = require("path");

const USER_DIRECTORY = process.env.PWD ? process.env.PWD : process.cwd();
const PRIJECT_NAME = parse(USER_DIRECTORY).name;
const TEMPLATE_DIRECTORY = resolve(__dirname, "template");
const QUESTIONS = [{
    type: "input",
    prefix: c.greenBright(">"),
    default: "",
    message: "Enter description of your project:",
    name: "description"
  },
  {
    type: "input",
    prefix: c.greenBright(">"),
    default: "",
    message: "What is your name?",
    name: "author"
  }
];

const CURRENT_PREFIX = ".";
const resolveTemplate = path => resolve(TEMPLATE_DIRECTORY, path);
const resolveUser = path => resolve(USER_DIRECTORY, path);
const l = message => {
  console.log(message);
};
const info = message => {
  l(c.bold("\n" + c.blue("i") + c.italic(` ${message}`)));
};
const done = () => {
  l(c.greenBright("\u2713 Done"));
};
const read = list =>
  list.map(filename => [
    filename,
    fs.readFileSync(resolveTemplate(join(CURRENT_PREFIX, filename))).toString()
  ]);
const READ_FILE_LIST = [
  'index.html',
  ".babelrc",
  ".editorconfig",
  ".eslintrc.js",
  ".gitignore",
  ".prettierrc.js",
  ".prettierignore",
  join("test", "index.test.js"),
  "webpack.base.config.js",
  "webpack.dev.config.js",
  "webpack.prod.config.js",
  "openBrowser.js"
];
const CONFIG_FILE_LIST = [
  "webpack.base.config.js",
  "webpack.dev.config.js",
  "webpack.prod.config.js",
  "openBrowser.js"
];

const TEST_FILE_LIST = [
  "index.jest.js"
]

const dirmap = new Map(
  [
    ['webpackConfig', CONFIG_FILE_LIST],
    ['test', TEST_FILE_LIST]
  ]
)

const write = (files, callback) => {
  files.forEach(([file, content]) => {
    let filePath = join(CURRENT_PREFIX, file);
    if (callback(file)) filePath = callback(file);

    fs.writeFileSync(resolveUser(filePath), content);
  });
};

function start() {
  l(`${c.blueBright("quick webpack start working")}`);
}

async function question() {
  info("Details of your project");
  let answers = {};
  const details = await inquirer.prompt(QUESTIONS);
  answers = { answers, ...details };
  return answers;
}

function scaffold(answers) {
  info("downloading files ...");
  const packageJSON = require("./template/package.json");

  packageJSON.name = PRIJECT_NAME;
  packageJSON.description = answers.description;
  packageJSON.author = answers.author;

  const readFileResult = read(READ_FILE_LIST);

  try {
    fs.mkdirSync("webpackConfig");
    fs.mkdirSync("src");
    fs.mkdirSync("test");
  } catch {
    info("The webpackConfig or src or test dir has existed");
  }

  fs.writeFileSync(resolveUser("./src/index.js"), JSON.stringify());
  fs.writeFileSync(
    resolveUser("./package.json"),
    JSON.stringify(packageJSON, null, 2)
  );
  write(readFileResult, file => {
    for (const [dir, list] of dirmap) {
      if (list.includes(file)) return join(CURRENT_PREFIX, dir, file);
    }
  });
  done();
}

function install() {
  info("Installing Dependencies");
  l(c.gray("May take few minutes..."));
  try {
    execSync(`cd ${USER_DIRECTORY} && yarn install`, { stdio: [0, 1, 2] });
  } catch (err) {
    execSync(`cd ${USER_DIRECTORY} && npm install`, { stdio: [0, 1, 2] });
  }
  done();
}

function footer() {
  l(
    `
    Your Project has created!
    - ${c.blue(`Learn how to config webpack:
      https://https://webpack.js.org/configuration/`)}
`
  );
}

(async () => {
  start();
  const answers = await question();
  scaffold(answers);
  install();
  footer();
})();
