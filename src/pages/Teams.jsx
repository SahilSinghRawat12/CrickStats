import React from 'react'
import Sidebar from '../components/headers/Sidebar'
import TeamContent from '../components/content/TeamContent'
import { useState  } from 'react'

const Teams = () => {

  const [isOpen , setIsOpen] = useState(true);
  return (
    <div className='flex h-screen'>
       <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
       
       <div className={`flex flex-1 transition-all duration-300 bg-[#f9fafb]  
        ${isOpen ? 'ml-[250px]' : 'ml-[100px]'}
        `}>
            <TeamContent />
      </div>
    </div>
  )
}

export default Teams