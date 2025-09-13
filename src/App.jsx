import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation, Link } from 'react-router-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import Home from './pages/HomePage'
import MovieDetailsPage from './pages/MovieDetailsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import DragTest from './pages/DragTest';
import './App.scss';
import Profile from './pages/Profile';
import Test from './pages/Test';
import TierListPage from './pages/TierListPage';

function AppContent() {
  const [count, setCount] = useState(0)

  return (
    <>

      <Routes>
        <Route index element={<Home />} />
        <Route path='/user/:shortId/tierlist/:listId' element={<TierListPage />} />
        <Route path='/user/:shortId/tierlist/new' element={<TierListPage />} />
        {/* <Route index element={<Test />} /> */}
        <Route path='/movie/:movieId' element={<MovieDetailsPage />} />
        <Route path='/search' element={<SearchResultsPage />} />
        {/* <Route path='/dragTest' element={<DragTest />} /> */}
        {/* <Route index element={<DragTest />} /> */}
        {/* <Route path='/profile/:userId' element={<Profile />} /> */}
      </Routes>

    </>
  )
}

function App () {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <AppContent />
      </Router>
    </DndProvider>

    // <Router>
    //   <AppContent />
    // </Router>
  )
}

export default App
