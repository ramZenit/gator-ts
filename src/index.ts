import { read } from "fs";
import { readConfig, setUser } from "./config.js";

function main() {
  console.log("Hello, world!");
  setUser("Lane");
  const config = readConfig();
  console.log(config);
}

main();
