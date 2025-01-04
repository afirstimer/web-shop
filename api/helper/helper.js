import { promises as fs } from 'fs';

export const getProductValueByKey = (productInfo, key) => {
    const actualKey = Object.keys(productInfo).find(k => k.includes(key));
    return actualKey ? productInfo[actualKey] : null;
};

export const readJSONFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON file:', error.message);
    return [];
  }
};

export const writeJSONFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing JSON file:', error.message);
    throw error;
  }
};
