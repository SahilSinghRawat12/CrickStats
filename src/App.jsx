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

function App() {
  

  return (
    <div>
         
        <Routes>
           <Route path='/' element={<Home/>} />
           <Route path='/login' element={<Login/>} />
           <Route path='/register' element={<Register/>} />
           <Route path='/dashboard' element={<Dashboard/>} />
           <Route path='/teams' element={<Teams/>} />
           <Route path='/matches' element={<Matches/>} />
           <Route path='/players' element={<Players/>} />
           <Route path='/matches/details' element={<ScoreCard/>} />
           <Route path='/teams/teamdetails' element={<TeamDetailsPage/>} />
           <Route path='/teams/teamdetails/add_player' element={<AddingPlayers/>} />

        </Routes>
    </div>
  )
}

export default App
