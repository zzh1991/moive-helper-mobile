import React from 'react';
import axios from "axios"
import { Rate, Grid, Ellipsis, Image, Collapse } from 'antd-mobile'
import { GridItem } from 'antd-mobile/es/components/grid/grid'
import { parseDocument } from 'htmlparser2';
import { selectAll, selectOne} from 'css-select';

class MovieList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moives: []
    };
  }

  componentDidMount() {
    this.getMoives()
  }

  getImageUrl(element) {
    const imgs = selectAll('img', element);
    return imgs[0].attribs.src;
  }

  async getMoives() {
    const url = 'https://movie.douban.com/cinema/nowplaying/hangzhou/';
    try { 
      const data = await axios.get(url, {
        responseType: 'text',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // 'Access-Control-Allow-Origin': '*'
        }
      });
      const dom = parseDocument(data.data);
      const nowplaying = selectOne('#nowplaying', dom);
    
      const list = selectAll('.list-item', nowplaying);
      console.log(list);
    
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
      this.setState({
        moives: filmList
      })
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <div>
        {this.state.moives.map((movie) => {
          return (
            <Grid
              columns={2}
              gap={8}
              style={{
                alignItems: 'center'
              }}
            >
              <Grid.Item span={2}>
                <Collapse accordion>
                  <Collapse.Panel key='1' title={<a href={movie.url} target="_blank" rel="noreferrer">{movie.title}</a>}>
                    {movie.summary}
                  </Collapse.Panel>
                </Collapse>
              </Grid.Item>
              <Grid.Item span={2}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '17px'
                }}>
                  <Rate readOnly value={movie.rating / 2} />
                  <Ellipsis
                    direction='end'
                    content={movie.rating}
                  />
                </div>
              </Grid.Item>
              <Grid.Item span={2}>
                <Image
                  lazy
                  src={movie.imageLarge}
                />
              </Grid.Item>
            </Grid>
          );
        })}
      </div>
    );
  }
}

export default MovieList;