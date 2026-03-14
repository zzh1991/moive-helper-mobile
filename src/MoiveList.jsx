import React from 'react';
import axios from "axios"
import { Rate, Grid, Ellipsis, Image, Collapse, SearchBar, Button } from 'antd-mobile'
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
      moives: [],
      filteredMovies: [],
      searchValue: '',
      sortByRating: false  // 默认不按评分排序
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
      this.setState({
        moives: filmList,
        filteredMovies: filmList
      })
    } catch (error) {
      console.error(error);
    }
  }

  // 切换排序
  toggleSort = () => {
    const { filteredMovies, sortByRating } = this.state;
    const newSortState = !sortByRating;

    if (newSortState) {
      // 按评分倒序
      const sorted = [...filteredMovies].sort((a, b) => b.rating - a.rating);
      this.setState({ filteredMovies: sorted, sortByRating: newSortState });
    } else {
      // 恢复原始顺序（按 ID 或加载顺序）
      const { moives, searchValue } = this.state;
      if (!searchValue) {
        this.setState({ filteredMovies: moives, sortByRating: newSortState });
      } else {
        // 如果有搜索关键词，需要重新过滤
        const filtered = this.filterMovies(moives, searchValue);
        this.setState({ filteredMovies: filtered, sortByRating: newSortState });
      }
    }
  }

  // 过滤电影（提取为独立方法）
  filterMovies(movies, searchValue) {
    const keyword = searchValue.toLowerCase().trim();
    if (!keyword) return movies;

    return movies.filter(movie => {
      const titleMatch = movie.title && movie.title.toLowerCase().includes(keyword);
      const directorMatch = movie.directors && (
        Array.isArray(movie.directors)
          ? movie.directors.some(d => d.toLowerCase().includes(keyword))
          : movie.directors.toLowerCase().includes(keyword)
      );
      const castMatch = movie.casts && (
        Array.isArray(movie.casts)
          ? movie.casts.some(c => c.toLowerCase().includes(keyword))
          : movie.casts.toLowerCase().includes(keyword)
      );
      return titleMatch || directorMatch || castMatch;
    });
  }

  // 搜索处理
  handleSearch = (value) => {
    const { moives, sortByRating } = this.state;

    const filtered = this.filterMovies(moives, value);

    // 如果开启了评分排序，对搜索结果也进行排序
    const finalResult = sortByRating
      ? [...filtered].sort((a, b) => b.rating - a.rating)
      : filtered;

    this.setState({ filteredMovies: finalResult, searchValue: value });
  }

  // 清空搜索
  handleClear = () => {
    const { moives, sortByRating } = this.state;
    const finalResult = sortByRating
      ? [...moives].sort((a, b) => b.rating - a.rating)
      : moives;

    this.setState({
      filteredMovies: finalResult,
      searchValue: ''
    });
  }

  render() {
    const { filteredMovies, searchValue, sortByRating } = this.state;

    return (
      <div style={{ padding: '16px' }}>
        {/* 搜索栏 */}
        <div style={{ marginBottom: '16px' }}>
          <SearchBar
            placeholder='搜索电影、导演或演员'
            value={searchValue}
            onChange={this.handleSearch}
            onClear={this.handleClear}
          />
        </div>

        {/* 操作栏：统计 + 排序按钮 */}
        <div style={{
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: '#666', fontSize: '14px' }}>
            共 {filteredMovies.length} 部电影
          </span>
          <Button
            size='small'
            color={sortByRating ? 'primary' : 'default'}
            fill={sortByRating ? 'solid' : 'outline'}
            onClick={this.toggleSort}
          >
            {sortByRating ? '已按评分排序' : '按评分排序'}
          </Button>
        </div>

        {filteredMovies.map((movie) => {
          return (
            <Grid
              columns={2}
              gap={6}
              style={{
                alignItems: 'center',
                marginBottom: '12px'
              }}
              key={movie.id}
            >
              <Grid.Item span={2}>
                <Collapse accordion>
                  <Collapse.Panel
                    key={movie.id}
                    title={
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        border: '1px solid #e8e8e8',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          flex: 1,
                          overflow: 'hidden',
                          marginRight: '12px'
                        }}>
                          {/* 左侧装饰竖条 */}
                          <span style={{
                            width: '3px',
                            height: '20px',
                            background: 'linear-gradient(180deg, #1677ff 0%, #69c0ff 100%)',
                            borderRadius: '2px',
                            marginRight: '10px',
                            flexShrink: 0
                          }} />
                          <a
                            href={movie.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: '#1a1a2e',
                              fontWeight: 600,
                              fontSize: '16px',
                              flex: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              textDecoration: 'none',
                              letterSpacing: '0.3px'
                            }}
                          >
                            {movie.title}
                          </a>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          flexShrink: 0,
                          background: 'rgba(255, 149, 0, 0.08)',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          marginRight: '28px'
                        }}>
                          <span style={{
                            color: '#ff9500',
                            fontWeight: 700,
                            fontSize: '15px'
                          }}>
                            {movie.rating}
                          </span>
                          <Rate
                            readOnly
                            allowHalf
                            value={movie.rating / 2}
                            style={{ '--star-size': '11px' }}
                          />
                        </div>
                      </div>
                    }
                  >
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
                  justifyContent: 'center',
                  padding: '8px 0 16px'
                }}>
                  <Image
                    lazy
                    src={`/api/getMoviePic?moiveId=${movie.moiveId}`}
                    style={{
                      maxWidth: '180px',
                      width: '100%',
                      aspectRatio: '2 / 3',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.02)';
                      e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
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
