import { createAppShell } from "./components/app-shell.js";

const root = document.querySelector("#app");

if (root) {
  root.append(createAppShell());
}
