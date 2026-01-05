import React, { useState } from 'react'

const AddingPlayers = () => {

    
  return (
    <div className='h-screen w-full'>
        <div className='bg-red-500 h-full'>
            <div>
                 <label>Player Name</label>
                 <input 
                 placeholder='Enter Player Name'
                 />

                  <div>
                     <button>Batsman</button>
                     <button>Bowler</button>
                     <button>All Rounder</button>
                     <button>Wicket Keeper</button>
                  </div> 

                  <div>
                     <button>Captain</button>
                  </div>     
            </div>

           
        </div>
    </div>
  )
}

export default AddingPlayers