# PromptHub

PromptHub is an open-source project created by Bruno Delb. It is a React.js application designed to manage and organize GPT prompts, classified into categories. Each prompt can have a title, potential arguments to inject, and a status (active/inactive). The application also allows users to copy prompts to the clipboard with the injected arguments.

## Features

- **Manage Prompts:** Add, edit, delete, and organize prompts into categories.
- **Category Management:** Create, update, and delete categories to better organize your prompts.
- **Copy to Clipboard:** Easily copy prompts to the clipboard with any custom arguments injected.
- **Database Backup and Restore:** Export and import your prompt database to a JSON file for backup and restoration.
- **LLM Management:** Manage and configure various Large Language Models (LLMs) used within the application.
- **Responsive Design:** Built using Chakra UI for a responsive and accessible user interface.

## Installation

To get started with PromptHub, follow these steps:

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 12 or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Steps

1. **Clone the repository:**

    ```bash
    git clone https://github.com/GitCryptoDevOps/prompt-hub.git
    cd prompt-hub
    ```

2. **Install dependencies for the main application:**

    Navigate to the `react-app` directory:

    ```bash
    cd react-app
    ```

    Install the dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Build the application:**

    ```bash
    npm run build
    # or
    yarn build
    ```

4. **Run the development server:**

    ```bash
    npm start
    # or
    yarn start
    ```

    This will start the application on `http://localhost:3000`.

## Usage

### Managing Prompts

1. Navigate to the "Manage Prompts" section from the navigation bar.
2. Add a new prompt by filling out the title, category, and content fields.
3. Use the edit and delete buttons to modify or remove existing prompts.
4. You can filter prompts by category and search by keywords.

### Category Management

1. Navigate to the "Categories" section from the navigation bar.
2. Add, update, or delete categories to organize your prompts.

### Backup and Restore

1. Go to the "Settings" section.
2. Use the "Export Database" button to download a JSON file of your current database.
3. Use the "Import Database" button to restore a database from a JSON file.

### LLM Management

1. Navigate to the "LLMs" section from the navigation bar.
2. Add and configure different Large Language Models (LLMs) used within the application.
3. Update or remove LLMs as necessary.

## Chrome Extension

The `chrome-extension` directory contains a Chrome extension related to PromptHub. **Please note that the Chrome extension is currently not operational**. If you are interested in using or developing the extension, you may need to resolve issues related to Content Security Policy (CSP) and other configuration settings.

## Contributing

PromptHub is an open-source project, and contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push the branch to your fork.
4. Open a pull request with a detailed description of your changes.

### Code of Conduct

Please adhere to the project's [Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/), ensuring a welcoming and respectful environment for everyone.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).

### You are free to:

- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material

### Under the following terms:

- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- **NonCommercial** — You may not use the material for commercial purposes.

For more information, visit the [Creative Commons website](https://creativecommons.org/licenses/by-nc/4.0/).

## Credits

- **Bruno Delb** - Creator and maintainer of PromptHub. Connect with me on:
  - [Medium](https://medium.com/@bruno_delb)
  - [LinkedIn](https://www.linkedin.com/in/brunodelb)
  - [YouTube](https://www.youtube.com/channel/UCBrunoDelb)

## Acknowledgements

- Thanks to the open-source community for providing inspiration and tools that made this project possible.
- [Chakra UI](https://chakra-ui.com/) for providing a fantastic UI framework.

---

If you have any questions or need further assistance, feel free to reach out via [LinkedIn](https://www.linkedin.com/in/brunodelb), [Medium](https://medium.com/@bruno_delb), or [YouTube](https://www.youtube.com/channel/UCBrunoDelb).
