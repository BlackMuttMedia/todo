// TODO: This is duplicated here and api/index.js - should combine
const API_PREFIX = "/api/v1";
const getApiRoute = path => `${API_PREFIX}${path}`;

const routePaths = {
  todos: "/todos/",
  archived: "/todos/archived/",
  todo: "/todos/:id/",
  reorder: "/todos/reorder/",
  archive: "/todos/archive/",
  unarchive: "/todos/unarchive/"
};

const colors = {
  light: "#FFF",
  primary: "#532679",
  gray: "#EFEFEF",
  grayBorder: "#DDD",
  error: "#F00"
};

const fontSizes = {
  big: "24px",
  medium: "20px",
  small: "16px",
  tiny: "12px"
};

const config = {
  colors,
  fontSizes,
  getApiRoute,
  routePaths
};

export default config;
