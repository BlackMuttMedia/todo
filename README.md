## Todo list example

This is an example app using yarn workspaces, node + express API, and a React front-end.

#### Installation

From the root level of the project

```js
yarn install && yarn start
```

This starts the express server, react front-end, and styleguidist document.

To view the page, navigate to localhost:3000 -- it proxies to the API at port 3001.

To view the styleguide, navigate to locahost:6060

#### Frontend

The Frontend was created using create-react-app and utilizes some things like [Styleguidist](https://github.com/styleguidist/react-styleguidist) and [React Beautiful DND](https://github.com/atlassian/react-beautiful-dnd)

#### Backend

The backend code is a standard express app but uses [Backpack](https://github.com/jaredpalmer/backpack) for some of the nice features it brings.

To run the tests, navigate to `./packages/api` and run `yarn test`
