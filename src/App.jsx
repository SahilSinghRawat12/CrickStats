import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { Route, Routes } from 'react-router-dom'
import Teams from './pages/Teams' 
import Matches from './pages/Matches'
import Players from './pages/Players'
import ScoreCard from './pages/ScoreCard'
import TeamDetailsPage from './pages/TeamDetailsPage'
import AddingPlayers from './pages/AddingPlayers'
import AddTeam from './pages/AddTeam'
import AddMatch from './pages/AddMatch'
import LiveScore from './pages/LiveScore'
import MatchSummary from './pages/MatchSummary'
import PrivateRoute from './context/PrivateRoute'

function App() {
  

  return (
    <div>
         
        <Routes>
           <Route path='/' element={<Home/>} />
           <Route path='/login' element={<Login/>} />
           <Route path='/register' element={<Register/>} />
           
           <Route path='/dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>} />
           <Route path='/teams' element={<PrivateRoute><Teams/></PrivateRoute>} />
           <Route path='/teams/addteam' element={<PrivateRoute><AddTeam/></PrivateRoute>} />
           <Route path='/teams/:teamId' element={<PrivateRoute><TeamDetailsPage/></PrivateRoute>} />
           <Route path='/teams/:teamId/add_player' element={<PrivateRoute><AddingPlayers/></PrivateRoute>} />
           <Route path='/matches' element={<PrivateRoute><Matches/></PrivateRoute>} />
           <Route path='/matches/create_match' element={<PrivateRoute><AddMatch/></PrivateRoute>} />
           <Route path='/matches/details' element={<PrivateRoute><ScoreCard/></PrivateRoute>} />
           <Route path='/players' element={<PrivateRoute><Players/></PrivateRoute>} />
           <Route path='/matches/live_match' element={<PrivateRoute><LiveScore/></PrivateRoute>} />
           <Route path="/match-summary" element={<PrivateRoute><MatchSummary /></PrivateRoute>} />

        </Routes>
    </div>
  )
}

export default App
