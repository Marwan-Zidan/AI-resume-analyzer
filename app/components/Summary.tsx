import React from 'react'
import ScoreGuage from './ScoreGauge';
const Summary = () => {
  return (
    <div className="bg-white w-full rounded-2xl shadow-md  " >
      <div className='flex flex-col items-center  p-4 gap-8'>
        <h2 className='text-3xl font-bold text-gray-800'>Summary</h2>
        <ScoreGuage  />
      </div>
    </div>
  )
}

export default Summary
