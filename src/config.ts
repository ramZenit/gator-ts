import os from "os";
import fs from "fs";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function readConfig(): Config {
  const configPath = getConfigilePath();

  if (!fs.existsSync(configPath)) {
    const config: Config = {
      dbUrl: "postgres://example",
      currentUserName: "",
    };
    writeConfig(config);
    return config;
  }

  const json = fs.readFileSync(configPath, "utf-8");
  validateConfig(JSON.parse(json));
  const config: Config = JSON.parse(toCamelCase(json));
  return config;
}

export function getCurrentUser(): string {
  const config = readConfig();
  return config.currentUserName;
}

export function setUser(username: string): void {
  const config = readConfig();
  config.currentUserName = username;
  writeConfig(config);
}

function getConfigilePath(): string {
  return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(config: Config): void {
  const configPath = getConfigilePath();
  const json = toSnakeCase(JSON.stringify(config, null, 2));
  fs.writeFileSync(configPath, json, "utf-8");
}

function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .split(/[_\s-]+/)
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
}

function toSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

function validateConfig(rawConfing: any) {
  if (!rawConfing.db_url || typeof rawConfing.db_url !== "string") {
    throw new Error("Invalid or missing 'db_url' in config");
  }
  if (
    rawConfing.current_user_name == null ||
    typeof rawConfing.current_user_name !== "string"
  ) {
    throw new Error("Invalid or missing 'current_user_name' in config");
  }
}
