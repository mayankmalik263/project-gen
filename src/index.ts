import ollama from "ollama";

import type { BunFile } from "bun";
import type { Message } from "ollama";

const llm_model = "llama3.2";

let projectName: string;
let programmingLanguage: "python" | "javascript" | "c++" | "java" | "c#";

const generateReadme = async (
  projectName: string,
  programmingLanguage: "python" | "javascript" | "c++" | "java" | "c#"
) => {
  const prompt = `Hello AI. I am a ${programmingLanguage} developer. I am working on a project called ${projectName}.
  Generate a README file for me.

  It should follow the following format:

  \\START
    # ${projectName}
    
    ## Description
    
    [DESCRIPTION]

    ## Features

    - [FEATURE 1]
    - [FEATURE 2]
    - [FEATURE 3]
    - ...

    ## Features Breakdown

    ### [FEATURE 1]

    [DESCRIPTION]

    - [TASK 1]
    - [TASK 2]
    - [TASK 3]
    - ...

    ### [FEATURE 2]

    [DESCRIPTION]

    - [TASK 1]
    - [TASK 2]
    - [TASK 3]
    - ...

    ### [FEATURE 3]

    [DESCRIPTION]

    - [TASK 1]
    - [TASK 2]
    - ...
  \\END

  Now, another thing. ONLY respond with the generated Markdown content. Do not type anything else. Do not reference this prompt.
  Just generate the README file content.
  `;

  const message: Message = {
    role: "user",
    content: prompt,
  };

  const response = await ollama.chat({ model: llm_model, messages: [message] });

  const readmeContent = response.message.content;

  await Bun.write(
    "generated-README.md",
    readmeContent.replace(/\\START|\\END/g, "")
  );
};

console.log("Welcome to the Project Generator!");

process.stdout.write("Enter the project name: ");

let inputStage = 0;

process.stdin.on("data", async (data) => {
  const input = data.toString().trim();

  if (inputStage === 0) {
    projectName = input;
    process.stdout.write(
      "Enter the programming language (python, javascript, c++, java, c#): "
    );
    inputStage++;
  } else if (inputStage === 1) {
    if (["python", "javascript", "c++", "java", "c#"].includes(input)) {
      programmingLanguage = input as
        | "python"
        | "javascript"
        | "c++"
        | "java"
        | "c#";
      await generateReadme(projectName, programmingLanguage);
      process.exit();
    } else {
      process.stdout.write(
        "Invalid language. Please enter one of the following: python, javascript, c++, java, c#: "
      );
    }
  }
});
