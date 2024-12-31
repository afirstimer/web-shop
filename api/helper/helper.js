
export const getProductValueByKey = (productInfo, key) => {
    const actualKey = Object.keys(productInfo).find(k => k.includes(key));
    return actualKey ? productInfo[actualKey] : null;
};