import { createAppShell } from "./app.js";

const root = document.querySelector("#app");

if (root) {
  root.append(createAppShell());
}
