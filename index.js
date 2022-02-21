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
        "Really? Hmm that sounds... interesting.\n Lets see if you can really convince me - write me a compelling description of your project:",
    },
    {
      type: "number",
      name: "install",
      message: `Wowza! Sorry I ever doubted you ${promptOneAnswers.name}.\n Ok, lets talk installation. How many step by step instructions are you going to need here? Give me a number:`,
    },
  ]);
  return promptTwoAnswers;
};

const promptThree = (promptTwoAnswers) => {
  finalAnswers = { ...finalAnswers, ...promptTwoAnswers };
  const array = [];
  for (i = 0; i < promptTwoAnswers.install; i++) {
    array.push({
      type: "input",
      name: `installQuestion${i + 1}`,
      message: `Please enter instruction ${i + 1}:`,
    });
  }
  return inquirer.prompt(array);
};

const promptFour = (promptThreeAnswers) => {
  finalAnswers = { ...finalAnswers, promptThreeAnswers };
  return inquirer.prompt([
    {
      type: "input",
      name: "usage",
      message: `Ok ${finalAnswers.name}, ${finalAnswers.title}'s Readme is looking good so far.\n Let's get an idea now of what this thing actually does!\n Describe the uses for and how to use the project:`,
    },
    {
      type: "number",
      name: "contributors",
      message: `Blimey. And how many poor souls have you roped into this? Or is it just you ${finalAnswers.name}? Give me a number of contributors:`,
    },
  ]);
};

const promptFive = (promptFourAnswers) => {
    finalAnswers = { ...finalAnswers, ...promptFourAnswers };
    const array = [];
    for (i = 0; i < promptFourAnswers.contributors; i++) {
      array.push({
        type: "input",
        name: `contributor${i + 1}`,
        message: `Give me the name and GitHub for person ${i + 1}:`,
      });
    }
    return inquirer.prompt(array);
  };

const returnFinal = (promptFiveAnswers) => {
    console.log(promptFiveAnswers)
  return finalAnswers = { ...finalAnswers, promptFiveAnswers };
}

const generateReadme = ({ title, description, promptThreeAnswers, usage, promptFiveAnswers }) =>
  `
# ${title}

## Description

${description}

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [License](#license)
4. [Contributing](#contributing)
5. [Tests](#tests)
6. [Questions](#questions)

## Installation

- ${Object.values(promptThreeAnswers).join("\n- ")}

## Usage

${usage}

## License

## Contributing

- ${Object.values(promptFiveAnswers).join("\n- ")}

## Tests

## Questions
  `;

const init = () => {
  promptOne()
    .then(promptTwo)
    .then(promptThree)
    .then(promptFour)
    .then(promptFive)
    .then(returnFinal)
    .then((answers) => fs.writeFileSync("README.md", generateReadme(answers)))
    .then(() => console.log("Successfully wrote to README.md"))
    .catch((err) => console.error(err));
};

init();
