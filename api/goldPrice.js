const axios = require('axios');

const getGoldPrice = async() => {
  try {
    // goldprice.org 已封禁直接访问(403)，改用 gold-api.com 免费接口
    const result = await axios.get('https://api.gold-api.com/price/XAU/CNY', {
      timeout: 10000,
    });
    // price 为每盎司价格，除以 31.1036 换算为每克
    const price = (result.data.price / 31.1036).toFixed(2);
    let suggestion = '';
    if (price <= 890) {
      suggestion = '可以考虑买入！！！';
    }
    return {
      'price': price,
      'suggestion': suggestion,
      'date': new Date(),
    }
  } catch (error) {
    console.error(error);
    return {}
  }
};

export default async function handler(request, response) {
  const goldPrice = await getGoldPrice();
  response.setHeader('Access-Control-Allow-Origin', '*');
  return response.status(200).json({
    body: goldPrice,
  });
}