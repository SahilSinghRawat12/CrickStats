import React, { useEffect, useState } from 'react'
import Sidebar from '../components/headers/Sidebar'
import DashContent from '../components/content/DashContent'
import TopPlayers from '../components/content/TopPlayers'
 

const Dashboard = () => {

  const [isOpen , setIsOpen] = useState(true);
  return (
    <div className='flex h-full'>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className={`flex flex-1 transition-all duration-300 bg-[#f9fafb] pb-4  
        ${isOpen ? 'md:ml-[250px]' : 'md:ml-[80px]'}
        `}>
      <DashContent />
        {/* <TopPlayers /> */}
      </div>

    </div>
  )
}

export default Dashboard