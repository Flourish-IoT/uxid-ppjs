## Getting Started

Clone the repo to your local computer

1. In your terminal `cd` to the project root folder and run `npm install`.
2. Drop the secret.env file into the project root:

    - You can find the secret.env file in Teams > UX > Files Tab > PPJ Website.

3. Rename the file from "secret.env" to ".env"

## Available Scripts

In the project directory, you can run:

### Dev Build: `npm run dev`

Runs the app in the development mode.

The page should automatically open, if not goto http://localhost:3000

React will re-compile and reload if you make edits.

### Launch Express Server: `npm start`

Runs the server.js express server.

This serves the build folder if it is present, like for the Heroku server.

### For Testing Purposes: `npm run build`

Builds the React app into `./build`.

This does not automatically build.

Open http://localhost:5050 to see the obfuscated build version. You cannot debug this version.
