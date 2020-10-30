import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'
import Header from './components/Header/Header'
import MainContainer from './components/MainContainer/MainContainer'
import FlashMessage from './components/FlashMessage/FlashMessage'

function App () {
  return (
    <Router>
      <div className='App'>
        <Header />
        <MainContainer />
        <FlashMessage />
      </div>
    </Router>
  )
}

export default App
