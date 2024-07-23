
# Expense Tracker PWA

This project is an Expense Tracker Progressive Web Application (PWA) built with React, Redux, TypeScript, and Styled Components. The application helps users to manage their expenses efficiently by providing functionalities to add, track, and categorize expenses.

## Features

- Add new expenses manually, via audio, or by uploading an image of a receipt.
- Categorize expenses into various categories and subcategories.
- Offline capabilities enabled by a service worker.
- Responsive design for optimal use on mobile and desktop devices.
- Redux for state management to ensure a predictable state container.
- TypeScript for type safety and better developer experience.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/expense-tracker-pwa.git
    ```
2. Navigate to the project directory:
    ```sh
    cd expense-tracker-pwa
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.Open [http://localhost:3002](http://localhost:3002) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run eject`

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## Folder Structure

- `src/`: Contains the source code of the application.
  - `components/`: Reusable React components.
    - `common/`: Common components used across the application.
    - `expenses/`: Components related to the expense functionalities.
  - `services/`: API service files.
  - `store/`: Redux store setup and slices.
  - `styles/`: Styled Components themes and global styles.
  - `types/`: TypeScript types and interfaces.
  - `hooks/`: Custom React hooks.
- `public/`: Static files.
- `build/`: Production build files.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or suggestions, feel free to open an issue or contact me at [alex@alexdepablos.com].
