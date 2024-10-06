# TodoHub

TodoHub is a privacy-focused task management application built with **Next.js** and **TypeScript**. It features a clean, responsive interface for managing your to-dos, with no server-side storage, your data stays in your browser.

## Features
- **Task Management:** Add, edit, and delete tasks.
- **Privacy-Focused:** No data is stored on any server. All tasks are saved locally using browser storage.
- **Completion Status:** Mark tasks as complete or incomplete.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## Technologies Used
- **Next.js**: Framework for server-side rendering and React.
- **TypeScript**: Static typing for JavaScript.
- **Local Storage**: Data persistence in the browser.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14.x or higher)
- [npm](https://npmjs.com) or [Yarn](https://yarnpkg.com/)

### Installation
Clone the repository:
```bash
git clone https://github.com/mosab3/todohub.git
cd todohub
npm install
```

### Running the Application
To start the development server, run:
```bash
npm run dev
# or
yarn dev
```
The app will be available at `http://localhost:3000`.

### Build for Production
To build the project for production:
```bash
npm run build
```
This will generate an optimized build in the `.next` directory.

### Linting and Formatting
- Run ESLint:
```bash
npm run lint
```
- Format code with Prettier:
```bash
npm run format
```

## Folder Structure
```bash
.
├── components      # Reusable UI components
├── pages           # Next.js pages and routes
├── public          # Static assets
├── styles          # Global and modular CSS
# └── utils           # Utility functions
```

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add YourFeature'`).
4. Push to your branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License
This project is licensed under the MIT License.

## Contact
For any questions or feedback, please reach out through the repository's [issues](https://github.com/mosab3/todohub/issues).