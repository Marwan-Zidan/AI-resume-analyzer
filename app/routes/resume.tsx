import { useParams } from 'react-router';


export const meta = () => [
  { title: "Resumind | Review" },
  { name: "description", content: "Detailed overview of your resume" },
];
const resume = () => {
  const { id } = useParams();
  return (
    <div>
          <h1>Resume  {id}</h1>
    </div>
  )
}

export default resume
