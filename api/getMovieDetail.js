const axios = require('axios');
const htmlparser2 = require("htmlparser2");
const CSSselect = require("css-select");

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
  console.log(summary)
  return summary
}

getMovieDetail(35593344)