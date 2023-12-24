import React from 'react';
import axios from "axios"
import { Rate, Grid, Ellipsis, Image, Collapse } from 'antd-mobile'
import { GridItem } from 'antd-mobile/es/components/grid/grid'
import { parseDocument } from 'htmlparser2';
import { selectAll, selectOne} from 'css-select';

const getMoiveSummary = async(movieId) => {
  const url = `https://movie.zzhpro.com/api/getMovieDetail?movieId=${movieId}`;
  try { 
    const data = await axios.get(url, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
    const summary = data.data.summary;
    return summary;
  } catch (error) {
    console.error(error);
  }  
}

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
    const url = 'https://movie.zzhpro.com/api/recent';
    try { 
      const data = await axios.get(url, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
      const filmList = data.data.body;
      // for (const film of filmList) {
      //   let summary = film.summary;
      //   if (summary === undefined || summary === null || summary === 'null' || summary === '') {
      //     summary = await getMoiveSummary(film.moiveId);
      //     film.summary = summary;
      //   }
      // }
      this.setState({
        moives: filmList || []
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