const fs = require('fs');
const path = require('path');

const getFilePath = (modelName) => path.join(__dirname, `../../data/${modelName}.json`);

const readData = (modelName) => {
  const filePath = getFilePath(modelName);
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf-8');
  return data ? JSON.parse(data) : [];
};

const writeData = (modelName, data) => {
  const filePath = getFilePath(modelName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const generateId = () => Math.random().toString(36).substr(2, 9);

module.exports = {
  readData,
  writeData,
  generateId
};
