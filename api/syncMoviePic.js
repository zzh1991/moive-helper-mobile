const axios = require('axios');
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const getPic = async(url) => {
    const response = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: {
          'Referer': 'https://www.douban.com/',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
  
      // 2. 转换为 Buffer
      const imageBuffer = Buffer.from(response.data);
      const contentType = response.headers['content-type'];

      return {
        mimeType: contentType,
        data: imageBuffer,
      };
}

const getRecentMoviePic = async(moiveId) => {
    const movie = await prisma.film_list.findFirst({
      where: {
        moiveId: Number(moiveId),
      }
    });
    if (movie) {
      const pic = await getPic(movie.imageLarge);
      await prisma.film_list.update({
        where: {
          moiveId: Number(moiveId),
        },
        data: {
          mimeType: pic.mimeType,
          data: pic.data,
        },
      });
    }

    await prisma.$disconnect();
  }

export default async function handler(request, response) {
  await getRecentMoviePic(request.query.moiveId);
  response.setHeader('Access-Control-Allow-Origin', '*');
  return response.status(200).json({
    body: {
        success: true,
    },
  });
}
