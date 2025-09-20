# ToDoList v1

A simple, server-rendered To-Do List web application built with Node.js, Express and EJS. The app displays a daily default list (using the system date) and supports custom lists via URL parameters. It communicates with a separate backend API for persistence and demonstrates basic CRUD operations from the server-side using fetch.

## Features

- Rendered UI using EJS templates.
- Default daily to-do list powered by a date helper.
- Custom lists accessible at `/:customListName`.
- Add and delete items for both default and custom lists.
- Static assets served from `public/` (CSS).
- Uses an external API endpoint for data persistence (configured in `app.js`).

## Tech stack

- Node.js
- Express
- EJS templating
- body-parser
- MongoDB / Mongoose (models defined but the app uses an external API)
- Lodash

## Project structure

- `app.js` — main Express application, routes, and view rendering.
- `date.js` — helper module to format the current date for the default list title.
- `views/` — EJS templates (`header.ejs`, `footer.ejs`, `list.ejs`, `about.ejs`).
- `public/css/styles.css` — styling for the app UI.
- `index.html` — placeholder HTML file.
- `package.json` — project metadata and dependencies.

## Configuration

The application is configured to talk to an external ToDoList API. The endpoint is defined by the constant `ToDoListRoute` inside `app.js`:

```
const ToDoListRoute = "https://threebdojapi.onrender.com/todolist"
```

If you want the app to use a different backend (for example a local API), update `ToDoListRoute` accordingly.

## Installation

1. Clone the repository:

   git clone <repository-url>

2. Install dependencies:

   npm install

3. (Optional) If you run a local backend instead of the external API, update `ToDoListRoute` in `app.js`.

## Running the app

Start the server:

   node app.js

By default the app listens on port 3000. Open http://localhost:3000 in a browser.

## Usage

- Visit the root path `/` to see the default to-do list (titled with the current date).
- Create or visit a custom list at `/:customListName` (for example `/work`).
- Add a new item by typing into the New Item input and clicking the `+` button.
- Delete an item by toggling its checkbox.

## Notes and assumptions

- The repository contains Mongoose models (`Item` and `List`) but the app currently performs persistence via the external API. If switching to direct database access, ensure MongoDB is running and update the connection logic in `app.js`.
- Environment-specific configuration (ports, API endpoints) are currently hard-coded. For production use, consider introducing environment variables.

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`.
3. Commit your changes and open a pull request.

Keep changes focused and include tests or screenshots where helpful.

## License

This project is provided under the ISC license (see `package.json`).

## Acknowledgements

Built with Express, EJS, and community open-source libraries.
