import axios from "axios";

export function Log(stack, level, pkg, message) {
  const validStacks = ["backend", "frontend"];
  const validLevels = ["debug", "info", "warn", "error","fatal"];
  const validPackages = ["api", "component", "hook","page","state","style"];

  if (
    !validStacks.includes(stack) ||
    !validLevels.includes(level) ||
    !validPackages.includes(pkg)
  ) {
    console.error("Invalid log parameters");
    return;
  }

  const payload = { stack, level, package: pkg, message };

  axios
    .post("http://20.244.56.144/evaluation-service/logs", payload)
    .then(() => console.log("Log sent"))
    .catch((err) => console.error("Logging failed:", err.message));
}
