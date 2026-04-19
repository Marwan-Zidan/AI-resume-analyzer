import React from 'react'
import ScoreGauge from './ScoreGauge';
const Category = ({title , score}: {title: string, score: number})=>{
  const textColor = score > 70 ? 'text-green-600' : score > 49 ? 'text-yellow-600' : 'text-red-600';
  return (
    <div className='resume-summary'>
          <div className='category'>
            <div className='flex flex-row items-center gap-2 justify-center'>
              <p className='text-2xl'>{title}</p>
            </div>
            <p className='text-2xl'>
              <span className={textColor}>{score}</span> / 100
            </p>
          </div>
    </div>
  )
}
const Summary = ({feedback}: {feedback: Feedback}) => {
  return (
    <div className="bg-white w-full rounded-2xl shadow-md  " >
      <div className='flex flex-col items-center  p-4 gap-8'>
        <ScoreGauge score={feedback.overallScore} />
        <div className='flex flex-col  gap-2'>
          <h2 className='text-2xl font-bold'>Your Resume Score</h2>
          <p className=' text-sm text-gray-600 '>Your resume's overall score based on ATS compatibility, content quality, and formatting.</p>
        </div>
      </div>
      <Category title="Tone & Style" score={feedback.ToneAndStyle.score} />
      <Category title="Content" score={feedback.Contenent.score} />
      <Category title="Structure" score={feedback.Structure.score} />
      <Category title="Skills " score={feedback.Skills.score} />
    </div>
  )
}

export default Summary
