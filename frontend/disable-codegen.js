#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Ścieżki do plików webpack
const webpackConfigPath = path.resolve("./node_modules/react-scripts/config/webpack.config.js");

if (fs.existsSync(webpackConfigPath)) {
  console.log("Modyfikuję konfigurację webpack...");
  let content = fs.readFileSync(webpackConfigPath, "utf8");
  
  // Wyłączenie minimalizacji, która używa terser-webpack-plugin (zależnego od ajv)
  content = content.replace(/minimize: .+?,/g, "minimize: false,");
  
  // Zapisanie zmodyfikowanej konfiguracji
  fs.writeFileSync(webpackConfigPath, content, "utf8");
  console.log("Konfiguracja webpack zmodyfikowana pomyślnie!");
}

// Tworzenie mocków dla problematycznych modułów
const mockDirs = [
  "./node_modules/ajv/dist/compile",
  "./node_modules/ajv/lib/compile"
];

mockDirs.forEach(dir => {
  const fullPath = path.resolve(dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Utworzono katalog: ${fullPath}`);
  }
  
  const codegenPath = path.join(fullPath, "codegen.js");
  fs.writeFileSync(codegenPath, "module.exports = { _ : { getCode: () => \"return {}\" } };", "utf8");
  console.log(`Utworzono mock dla: ${codegenPath}`);
});

console.log("Wszystkie modyfikacje zakończone pomyślnie!");
