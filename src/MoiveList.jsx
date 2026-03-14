import React from 'react';
import axios from "axios"
import { Rate, Grid, Ellipsis, Image, Collapse } from 'antd-mobile'
import { GridItem } from 'antd-mobile/es/components/grid/grid'
import { parseDocument } from 'htmlparser2';
import { selectAll, selectOne} from 'css-select';

const getMoiveSummary = async(movieId) => {
  const url = `/api/getMovieDetail?movieId=${movieId}`;
  try { 
    const data = await axios.get(url);
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
    const url = '/api/recent';
    try { 
      const data = await axios.get(url);
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
      <div style={{ padding: '16px' }}>
        {this.state.moives.map((movie) => {
          return (
            <Grid
              columns={2}
              gap={8}
              style={{
                alignItems: 'center',
                marginBottom: '24px'
              }}
              key={movie.id}
            >
              <Grid.Item span={2}>
                <Collapse accordion>
                  <Collapse.Panel key={movie.id} title={<a href={movie.url} target="_blank" rel="noreferrer">{movie.title}</a>}>
                    <div style={{ padding: '12px 0' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>导演：</strong>{Array.isArray(movie.directors) ? movie.directors.join(' / ') : movie.directors}
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>演员：</strong>{Array.isArray(movie.casts) ? movie.casts.join(' / ') : movie.casts}
                      </div>
                      <div>
                        <strong>国家：</strong>{Array.isArray(movie.country) ? movie.country.join(' / ') : movie.country}
                      </div>
                    </div>
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
                  <Rate readOnly allowHalf
                    value={movie.rating / 2} 
                  />
                  <Ellipsis
                    direction='end'
                    content={movie.rating.toString()}
                  />
                </div>
              </Grid.Item>
              <Grid.Item span={2}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '12px 0'
                }}>
                  <Image
                    lazy
                    src={`/api/getMoviePic?moiveId=${movie.moiveId}`}
                    style={{
                      maxWidth: '280px',
                      width: '100%',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </div>
              </Grid.Item>
            </Grid>
          );
        })}
      </div>
    );
  }
}

export default MovieList;