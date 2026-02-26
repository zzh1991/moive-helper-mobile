const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


export default async function handler(request, response) {
    const moiveId = request.query.moiveId;
    const movie = await prisma.film_list.findUnique({
        where: {
          moiveId: Number(moiveId),
        }
      });

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', movie.mimeType);
    return response.status(200).send(movie.data);
  }