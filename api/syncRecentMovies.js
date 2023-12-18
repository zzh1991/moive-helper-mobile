const axios = require('axios');
const htmlparser2 = require("htmlparser2");
const CSSselect = require("css-select");
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const url = 'https://movie.douban.com/cinema/nowplaying/hangzhou/';

const getMovies = async() => {
  const filmList = []
  try {
    const data = await axios.get(url, {
      responseType: 'text'
    });
    const dom = htmlparser2.parseDocument(data.data);
    const nowplaying = CSSselect.selectOne('#nowplaying', dom);
    const list = CSSselect.selectAll('.list-item', nowplaying);

    for (const element of list) {
      const attr = element.attribs;
      const summary = await getMovieDetail(Number(attr.id));
      filmList.push({
        moiveId: Number(attr.id),
        title: attr['data-title'],
        rating: parseFloat(attr['data-score']),
        movieYear: Number(attr['data-release']),
        country: attr['data-region'].split(' '),
        directors: attr['data-director'].split(' '),
        casts: attr['data-actors'].split('/'),
        url: `https://movie.douban.com/subject/${attr.id}`,
        imageLarge: getImageUrl(element),
        summary: summary,
        movieType: 'RECENT',
      });
    }

    filmList.sort((a, b) => {
      if (a.rating > b.rating) {
        return -1;
      }
      return 1;
    });

  } catch (error) {
    console.error(error);
  }
  // console.log(filmList);
  return filmList;
}

const getImageUrl = (element) => {
  const imgs = CSSselect.selectAll('img', element);
  return imgs[0].attribs.src;
}

const getMovieDetail = async(moiveId) => {
  const data = await axios.get(`https://movie.douban.com/subject/${moiveId}`, {
    responseType: 'text'
  });
  const dom = htmlparser2.parseDocument(data.data);
  const summaryElement = CSSselect.selectOne('#link-report-intra', dom);
  const spanList = CSSselect.selectOne("span", summaryElement);
  const children  = spanList.children;

  let summary = '';
  for (const item of children) {
    if (item.data === undefined) {
      continue;
    }
    summary = summary.concat(item.data.replace(/^\s\s*/, '').replace(/\s\s*$/, ''));
  }
  // console.log(summary)
  return summary
}

const syncRecentMoives = async() => {
  const filmList = await getMovies();
  if (filmList === undefined || filmList === null) {
    return;
  }
  const updateMovieType = await prisma.film_list.updateMany({
    where: {
      movieType: 'RECENT',
    },
    data: {
      movieType: 'NORMAL',
    },
  })

  for (const film of filmList) {
    const upsertFilmList = await prisma.film_list.upsert({
      where: {
        moiveId: film.moiveId,
      },
      update: {
        summary: film.summary,
        rating: film.rating,
        movieType: 'RECENT',
      },
      create: film,
    });
    // console.log(upsertFilmList);
  }
  await prisma.$disconnect();
}

syncRecentMoives()

export default async function handler(request, response) {
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return response.status(401).end('Unauthorized');
  }
  await syncRecentMoives();
  response.status(200).end('Sync recent movies!');

}