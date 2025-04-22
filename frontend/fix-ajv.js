// Skrypt naprawiający problem z ajv w środowisku Docker
const fs = require('fs');
const path = require('path');

console.log('Uruchamianie skryptu fix-ajv.js...');

// Ścieżka do pliku node_modules/ajv/dist/compile/codegen.js
const codegenDistPath = path.resolve(__dirname, 'node_modules/ajv/dist/compile/codegen.js');

// Ścieżka do pliku node_modules/ajv/lib/compile/codegen.js
const codegenLibPath = path.resolve(__dirname, 'node_modules/ajv/lib/compile/codegen.js');

// Zawartość mocka dla codegen
const mockContent = `
// Mock dla ajv codegen
const _ = {
  getCode: () => "return {}"
};

module.exports = { _ };
`;

// Funkcja sprawdzająca czy plik istnieje
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

// Funkcja tworząca katalog jeśli nie istnieje
function ensureDirectoryExists(dirPath) {
  const dirname = path.dirname(dirPath);
  if (fileExists(dirname)) {
    return true;
  }
  ensureDirectoryExists(dirname);
  fs.mkdirSync(dirname);
}

// Funkcja zapisująca mock do pliku
function writeMockToFile(filePath) {
  try {
    ensureDirectoryExists(filePath);
    fs.writeFileSync(filePath, mockContent);
    console.log(`Zapisano mock do pliku: ${filePath}`);
    return true;
  } catch (err) {
    console.error(`Błąd podczas zapisywania do pliku ${filePath}:`, err);
    return false;
  }
}

// Sprawdzenie i naprawienie pliku dist/compile/codegen.js
if (fileExists(codegenDistPath)) {
  console.log(`Plik ${codegenDistPath} już istnieje.`);
} else {
  console.log(`Plik ${codegenDistPath} nie istnieje. Tworzenie mocka...`);
  writeMockToFile(codegenDistPath);
}

// Sprawdzenie i naprawienie pliku lib/compile/codegen.js
if (fileExists(codegenLibPath)) {
  console.log(`Plik ${codegenLibPath} już istnieje.`);
} else {
  console.log(`Plik ${codegenLibPath} nie istnieje. Tworzenie mocka...`);
  writeMockToFile(codegenLibPath);
}

console.log('Skrypt fix-ajv.js zakończony.');
