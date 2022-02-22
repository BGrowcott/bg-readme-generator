const inquirer = require("inquirer");
const fs = require("fs");
let finalAnswers = {};
let minAnsLength = 1 //update once complete 

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
      validate(answer) {
        if (!answer) {
          return `At least type something in!`;
        }
        return true;
      },
    },
    {
      type: "input",
      name: "description",
      message:
        "Really? Hmm that sounds... interesting.\n Lets see if you can really convince me - write me a compelling description of your project:",
      validate(answer) {
        if (answer < minAnsLength) {
          return `Come on ${promptOneAnswers.name}, you can do better than that - try to use at least 20 letters`;
        }
        return true;
      },
    },
    {
      type: "input",
      name: "install",
      message: `Wowza! Sorry I ever doubted you ${promptOneAnswers.name}.\n Ok, lets talk installation. How many step by step instructions are you going to need here? Give me a number:`,
      validate(answer) {
        if (isNaN(answer)) {
          return "Please enter a number";
        }
        if (answer > 20) {
          return "Woah there, I think you mistyped that - Please enter no more than 20 instructions";
        }
        return true;
      },
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
      validate(answer) {
        if (!answer) {
          return `At least type something in!`;
        }
        return true;
      }
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

const promptSix = (promptFiveAnswers) => {
  finalAnswers = { ...finalAnswers, promptFiveAnswers };
  return inquirer.prompt([
    {
      type: "input",
      name: "tests",
      message:
        "Ok, so how can we be sure this thing really works?\n Can you give me some instructions for testing:",
    },
    {
      type: "input",
      name: "github",
      message: `Ok ${finalAnswers.name}, so what if I have questions?\n Please provide you GitHub URL:`,
    },
    {
      type: "input",
      name: "email",
      message: `And your email address:`,
    },
    {
      type: "list",
      name: "license",
      choices: ["option1", "option2", "option3"],
      message: `Nearly there now ${finalAnswers.name}! We just need to choose the right license.`,
    },
  ]);
};

const returnFinal = (promptSixAnswers) => {
  return (finalAnswers = { ...finalAnswers, promptSixAnswers });
};

const generateReadme = ({
  title,
  description,
  promptThreeAnswers,
  usage,
  promptFiveAnswers,
  tests,
  github,
  email,
}) =>
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

${tests}

## Questions

If you have any questions or suggestions please contact me via my GitHub or email:

[GitHub](${github})

[Email](mailto:${email})
  `;

const init = () => {
  promptOne()
    .then(promptTwo)
    .then(promptThree)
    .then(promptFour)
    .then(promptFive)
    .then(promptSix)
    .then(returnFinal)
    .then((answers) => fs.writeFileSync("README.md", generateReadme(answers)))
    .then(() => console.log("Successfully wrote to README.md"))
    .catch((err) => console.error(err));
};

init();
