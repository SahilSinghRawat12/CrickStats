import React from 'react'
import { useState } from 'react';
import Sidebar from '../components/headers/Sidebar';
import MatchContent from '../components/content/MatchContent';

const Matches = () => {
     const [isOpen , setIsOpen] = useState(true);
  return (
    <div className='flex h-screen'>
       
       <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
       
       <div className={`flex flex-1 transition-all duration-300 bg-[#f9fafb]  
        ${isOpen ? 'md:ml-[250px]' : 'md:ml-[80px]'}
        `}>
            <MatchContent />
      </div>
    </div>
  )
}

export default Matches