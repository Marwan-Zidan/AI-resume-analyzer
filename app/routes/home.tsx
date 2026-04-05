import { resumes } from "../../constants/index";
import Navbar from "../components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "../components/ResumeCard";
import { usePuterStore } from "~/lib/Puter"
import { useEffect } from "react";
import { useNavigate } from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reazume Analyzer" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}
export default function Home() {
  const { auth } = usePuterStore();
  const navigate = useNavigate();
  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated]);
  return (
  <main className="bg-[url('/images/bg-main.svg')] bg-cover">

<Navbar/>
<section className="main-section">  
<div className="page-heading  py-16">
  <h1>Track your application & Resume Rating</h1>
  <h2>Review your submissions and check AI-powered feedback. </h2>
</div>

{resumes.length>0 &&(
  <div className="resumes-section">
{resumes.map((resume) => (
  <ResumeCard key={resume.id} resume={resume} />
))}
</div>)}
</section>
  </main>
  );
};
