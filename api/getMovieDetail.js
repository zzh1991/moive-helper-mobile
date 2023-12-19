const axios = require('axios');
const htmlparser2 = require("htmlparser2");
const CSSselect = require("css-select");
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

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
  if (summary === '') {
    return
  }
  // console.log(summary)
  const updateMovieSummary = await prisma.film_list.update({
    where: {
      moiveId: moiveId,
    },
    data: {
      summary: summary,
      movieType: 'RECENT',
    },
  })
  await prisma.$disconnect();
  return summary;
}

// getMovieDetail(35694766)

export default async function handler(request, response) {
  const summary = await getMovieDetail(request.query.moiveId);
  response.setHeader('Access-Control-Allow-Origin', '*');
  return response.status(200).json({
    summary: summary,
  });
}