![SportSee logo.](/src/assets/img/logo.svg "Sportify tool")

# SportSee : an analytics tool for sportive people

![JavaScript](https://img.shields.io/badge/JavaScript-yellowgreen) ![REACT](https://img.shields.io/badge/React-blue)  ![D3](https://img.shields.io/badge/D3-red) ![css](https://img.shields.io/badge/CSS-lightgrey)

This project uses Javascript (ES7), CSS, [React](https://reactjs.org/) 18.2, [React Rooter](https://v5.reactrouter.com/web/guides/quick-start) 6.4, and [d3](https://d3js.org/) 7.6 and was bootstrapped with [Vite](https://vitejs.dev/)

## Getting started

## Running the backend

A backend is already running by default as a demo with data for two users at [https://bz0bje-3000.preview.csb.app](https://markdownlivepreview.com/).
If you decide to use it, you can directly run the frontend.

You can also clone the backend and run it locally :
```shell
git clone https://github.com/OpenClassrooms-Student-Center/P9-front-end-dashboard.git
cd P9-front-end-dashboard
yarn
yarn start
```

But before running the frontend, you will have then to edit the file /src/router.jsx by uncommenting the line 23 and commenting the line 24.

Before changes :
```shell
       loader: async ({ params }) => {
            // const api = new API('http://localhost:3000')
            const api = new API('https://bz0bje-3000.preview.csb.app')
```

After changes :
```shell
       loader: async ({ params }) => {
            const api = new API('http://localhost:3000')
            // const api = new API('https://bz0bje-3000.preview.csb.app')
```

## Running the frontend

You can start this fontend application either in development mode with
```shell
yarn run dev
```
and then access the application in development mode at the address [http://127.0.0.1:5173](http://127.0.0.1:5173/) (or the one indicated in the shell),

or you can build it in production mode with 
```shell
yarn build
```
and run it with 
```shell
yarn run preview
```
and then access the application in production mode at the address [http://127.0.0.1:4173](http://127.0.0.1:4173/) (or the one indicated in the shell)

When the app is running you will see a red switch-button in the upper left corner which will allow you to switch between the data of the two users

