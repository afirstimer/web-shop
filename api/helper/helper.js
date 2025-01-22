import axios from 'axios';
import prisma from '../lib/prisma.js';
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

export const getDefaultShop = async (req) => {
  let shop = null;  
  try {
    // if req.shopId is not exist, get user from token
    if (req.userId) {
      const user = await prisma.user.findUnique({
        where: {
          id: req.userId,
        },
      });
      console.log(user);

      if (user) {
        shop = await prisma.shop.findFirst({
          where: {
            userId: user.id,
          }
        });
      }

      if (shop) return shop;
    }

    if (!shop) {
      // if no shop. get first shop
      shop = await prisma.shop.findFirst();
    }
    
    if (shop) return shop;    
  } catch (error) {
    console.log(error);
    return null;
  }
}