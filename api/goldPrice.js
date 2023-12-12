const axios = require('axios');

const getGoldPrice = async() => {
  try {
    const result = await axios.get('https://data-asg.goldprice.org/dbXRates/USD,CNY', {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
      },
    });
    const price = (result.data.items[0].xauPrice / 31.1036).toFixed(2);
    let suggestion = '';
    if (price <= 420) {
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