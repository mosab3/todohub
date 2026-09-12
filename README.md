# TodoHub

TodoHub is a privacy-focused task management application built with **React** and **Vite**. It features a clean, responsive interface for managing your to-dos, with no server-side storage, your data stays in your browser.

## Features
- **Task Management:** Add, edit, and delete tasks.
- **Privacy-Focused:** No data is stored on any server. All tasks are saved locally using browser storage.
- **Completion Status:** Mark tasks as complete or incomplete.
- **Share over QR:** Export/import a list between devices with a QR code.
- **Dark Mode:** Toggle a persisted light/dark theme.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## Technologies Used
- **React**: UI library.
- **Vite**: Build tool and dev server.
- **TypeScript**: Static typing for JavaScript.
- **React Router**: Client-side routing for `/` and `/about`.
- **Bootstrap 5**: Styling and components.
- **Local Storage**: Data persistence in the browser.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [npm](https://npmjs.com)

### Installation
Clone the repository:
```bash
git clone https://github.com/mosab3/todohub.git
cd todohub
npm install
```

### Environment
The AdSense publisher id lives in an env file (optional):
```bash
echo "VITE_ADSENSE_PUB=your_pub_id" > .env.local
```

### Running the Application
To start the development server, run:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### Build for Production
To build the project for production:
```bash
npm run build
```
This type-checks the project and generates an optimized build in the `dist` directory. Preview it with:
```bash
npm run preview
```

### Type Checking
```bash
npm run typecheck
```

## Folder Structure
```bash
.
├── index.html        # Vite entry HTML
├── src
│   ├── main.tsx      # App bootstrap (styles + router)
│   ├── App.tsx       # Route definitions
│   ├── components    # Reusable UI components
│   ├── pages         # Route views
│   └── styles        # Global CSS
├── public            # Static assets
└── vite.config.ts
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
