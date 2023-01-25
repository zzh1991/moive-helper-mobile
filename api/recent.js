const axios = require('axios');
const htmlparser2 = require("htmlparser2");
const CSSselect = require("css-select");

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
    list.forEach(element => {
      const attr = element.attribs;
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
      });
    });
  } catch (error) {
    console.error(error);
  }
  return filmList;
}

const getImageUrl = (element) => {
  const imgs = CSSselect.selectAll('img', element);
  return imgs[0].attribs.src;
}


export default async function handler(request, response) {
  const filmList = await getMovies();
  return response.status(200).json({
    body: filmList,
  });
}