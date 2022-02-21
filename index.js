const inquirer = require("inquirer");
const fs = require("fs");
let finalAnswers = {};

const promptOne = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message:
        "Hello and welcome to your professional README generator.\n You will be prompted with a series of questions - please fill in answers carefully!\n First things first, who am I talking to?",
    },
  ]);
};

const promptTwo = (promptOneAnswers) => {
  finalAnswers = { ...promptOneAnswers };
  const promptTwoAnswers = inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: `Lovely! Thanks ${promptOneAnswers.name}! Ok now, ${promptOneAnswers.name} - what is the title of your project?`,
    },
    {
      type: "input",
      name: "description",
      message:
        "Really? Hmm that sounds... interesting.\n Lets see if you can really convince me - write me a compelling description of your project",
    },
    {
      type: "number",
      name: "install",
      message: `Wowza! Sorry I ever doubted you ${promptOneAnswers.name}.\n Ok, lets talk installation. How many step by step instructions are you going to need here?`,
    },
  ]);
  return promptTwoAnswers;
};

const promptThree = (promptTwoAnswers) => {
  finalAnswers = { ...finalAnswers, ...promptTwoAnswers };
  console.log(finalAnswers);
  const array = [];
  for (i = 0; i < promptTwoAnswers.install; i++) {
    array.push({
      type: "input",
      name: `installQuestion${i + 1}`,
      message: `Please enter instruction ${i + 1}`,
    });
  }
  return inquirer.prompt(array);
};

const promptFour = (promptThreeAnswers) => {
  finalAnswers = { ...finalAnswers, promptThreeAnswers };
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message:
        `Ok ${finalAnswers.name}, ${finalAnswers.title} looking good so far.`
    },
  ]);
};

const generateReadme = ({ title, description, promptThreeAnswers }) =>
  `
# ${title}

## Description

${description}

## Table of Contents

- Installation
- Usage
- License
- Contributing
- Tests
- Questions

## Installation

- ${Object.values(promptThreeAnswers).join("\n- ")}

## Usage

## License

## Contributing

## Tests

## Questions
  `;

const init = () => {
  promptOne()
    .then(promptTwo)
    .then(promptThree)
    .then(promptFour)
    .then((answers) => fs.writeFileSync("README.md", generateReadme(answers)))
    .then(() => console.log("Successfully wrote to README.md"))
    .catch((err) => console.error(err));
};

init();
