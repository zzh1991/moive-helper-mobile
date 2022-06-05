import React from 'react';
import axios from "axios"
import { Rate, Grid, Ellipsis, Image, Collapse } from 'antd-mobile'
import { GridItem } from 'antd-mobile/es/components/grid/grid'

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

  async getMoives() {
    const url = process.env.URL || 'https://movieshelper.herokuapp.com/movie/recent'
    try { 
      const response = await axios.get(url)
      this.setState({
        moives: response.data
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