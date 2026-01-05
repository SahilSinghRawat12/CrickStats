import React, { useState } from 'react'
import TeamDetails from '../components/details/TeamDetails';
import Sidebar from '../components/headers/Sidebar';

const TeamDetailsPage = () => {
  const [isOpen , setIsOpen] = useState(true);
  return (
    <div className='flex h-screen'>
       
       <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
       
       <div className={`flex flex-1 transition-all duration-300 bg-[#f9fafb]  
        ${isOpen ? 'ml-[250px]' : 'ml-[100px]'}
        `}>
            <TeamDetails />
      </div>
    </div>
  )
}

export default TeamDetailsPage