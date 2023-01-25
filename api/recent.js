import axios from "axios"
import { parseDocument } from 'htmlparser2';
import { selectAll, selectOne} from 'css-select';

getImageUrl = (element) => {
  const imgs = selectAll('img', element);
  return imgs[0].attribs.src;
}

export default async function handler(request, response) {
  const url = 'https://movie.douban.com/cinema/nowplaying/hangzhou/';
  const data = await axios.get(url, {
    responseType: 'text',
  });
  const dom = parseDocument(data.data);
  const nowplaying = selectOne('#nowplaying', dom);

  const list = selectAll('.list-item', nowplaying);

  const filmList = []
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

  return response.status(200).json({
    body: filmList,
  });
}