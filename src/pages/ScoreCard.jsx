import React from 'react'
import { useState } from 'react';
import Sidebar from '../components/headers/Sidebar';
import MatchScoreContent from '../components/content/MatchScoreContent'

const ScoreCard = () => {
    const [isOpen , setIsOpen] = useState(true);
  return (
    
    <div className='flex h-screen'>
       
       <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
       
       <div className={`flex flex-1 transition-all duration-300 bg-[#f9fafb]  
        ${isOpen ? 'ml-[250px]' : 'ml-[100px]'}
        `}>
            <MatchScoreContent />
      </div>
    </div>

  )
}

export default ScoreCard