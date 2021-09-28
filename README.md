# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm start`

Runs the server.js express server.\
This serves the build folder if it is present, like for the Heroku server.

### `npm run build`

Builds the React app into `./build`.\
Open `localhost:5000` to see the build version.

You will need to add the proxy to the package.json file to connect to the internal API:

`"proxy": "http://localhost:5000"` <- Do not commit this
