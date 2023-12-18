const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const allFilms = await prisma.film_list.findMany({
    where: {
      movieType: 'RECENT',
    },
    orderBy: {
      rating: 'desc',
    },
  })
  console.log(allFilms)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })