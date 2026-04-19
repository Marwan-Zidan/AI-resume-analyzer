import { type FormEvent, useState  } from "react";
import Navbar from "../components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/Puter";
import {useNavigate} from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";


const upload = () => {
  const {auth, isLoading, fs, ai, kv} = usePuterStore();
  const navigate = useNavigate();
  const [isprocessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const handelFileSelect = (file: File | null) => {
    setFile(file);
  }
  const handelingAnalyzing = async({companyName, jobTitle, jobDescription,file}: {companyName: string, jobTitle: string, jobDescription: string, file: File | null}) => {
      const fail = (message: string) => {
      setStatusText(message);
      setIsProcessing(false);
      };

      setIsProcessing(true);

        const fileName = file?.name?.toLowerCase() || "";
        const isPdf = file?.type === "application/pdf" || fileName.endsWith(".pdf");
        if (!isPdf) return fail('Error: Only PDF files are supported');

        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file as File]);
        if(!uploadedFile) return fail('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file as File);
        if(!imageFile.file) return fail(`Error: ${imageFile.error ?? 'Failed to convert PDF to image'}`);

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return fail('Error: Failed to upload image');

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const defaultFeedback = {
            overallScore: 0,
            ATS: { score: 0, tips: [] },
            toneAndStyle: { score: 0, tips: [] },
            content: { score: 0, tips: [] },
            structure: { score: 0, tips: [] },
            skills: { score: 0, tips: [] },
        };
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: defaultFeedback,
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription, AIResponseFormat: 'JSON' }),
        )
        if (!feedback) return fail('Error: Failed to analyze resume');

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis complete, redirecting...');
        console.log(data);
        navigate(`/resume/${uuid}`);

  }
  const handelSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;
    if (!file) return;
    handelingAnalyzing({companyName, jobTitle, jobDescription, file});


  };
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading  py-16">
          <h1>Smart feedback for your dream job</h1>
          {isprocessing ? (
            <>
            <h2>{statusText}</h2>
            <img src='../../public/images/resume-scan.gif' className="w-full"/>
            </>
          ) : (
            <h2>Drop your resume for an ATS score and improvement tips</h2>
          )}
          {!isprocessing && (
            <form id="upload-form" onSubmit={handelSubmit} className="flex flex-col gap-4 mt-8">
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea name="job-description" placeholder="Job Description" id="job-description" rows={5} /> 
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                  <FileUploader onFileSelect={handelFileSelect}/>
              </div>
              <button type="submit" className="primary-button">Analyze Resume</button>
            </form>
          )}
          
        </div>
      </section>
    </main>
  );
};
export default upload;
