import './App.css'
import { Rate, Grid, Ellipsis, Image, Collapse } from 'antd-mobile'
import { GridItem } from 'antd-mobile/es/components/grid/grid'
import MovieList from './MoiveList'

function App() {

const img = 'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2871809800.jpg'
const url = 'https://movie.douban.com/subject/35008440/'
const name= '唐顿庄园 2'
const rate = 8.5
const detail = `影片为2019年《唐顿庄园》电影的续集，在这一部故事中，唐顿庄园将迎来一个崭新的时代，与此同时，老伯爵夫人（玛吉·史密斯 Maggie Smith 饰）的一段神秘过往也将被揭晓。`

  return (
    <div className="App">
      <MovieList />
      
    </div>
  )
}

export default App
