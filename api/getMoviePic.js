const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


export default async function handler(request, response) {
    const moiveId = request.query.moiveId;
    const movie = await prisma.film_list.findUnique({
        where: {
          moiveId: Number(moiveId),
        }
      });

    if (!movie || !movie.data) {
      return response.status(404).json({ error: 'Image not found' });
    }

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', movie.mimeType);
    // HTTP 缓存：图片不常变化，缓存 1 天
    response.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    return response.status(200).send(movie.data);
  }