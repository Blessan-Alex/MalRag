import Image from "next/image";
import normal from "../public/normal.jpeg"

export default function Features(){
  return(
    <div className="h-full m-12  mt-44 w-full flex flex-col items-center justify-center">
      <div className="h-full gap-4 w-full flex items-start justify-evenly pt-32 px-12 text-white">
        <div>
          <h1 className="text-6xl font-sans hover:-translate-y-2 transition-all duration-500 font-bold mb-4">Upload.</h1>
          <p className="text-lg">
            Upload your documents and let the AI analyze them.
          </p>
        </div> 
        <div>
          <h1 className="text-6xl font-sans hover:-translate-y-2 transition-all duration-500 font-bold mb-4">Chat.</h1>
          <p className="text-lg">
            Chat with the AI and get the information you need.
          </p>
        </div>
        <div>
          <h1 className="text-6xl hover:-translate-y-2 transition-all duration-500 font-sans font-bold mb-4">Summarize.</h1>
          <p className="text-lg">
            Summarize your documents and get the information you need.
          </p>
        </div>
      </div>
      <div className="h-full w-full flex items-center justify-between text-white px-12">
        <div className="flex-1">
          <h1 className="text-6xl font-sans font-bold mb-8">
          WE'RE REVOLUTIONIZING  <br/> THE WAY GOOD WORK GETS  <br/> DONE.
          </h1>
          <p className="text-lg mb-4">
          You don't need theoretical AI. <br/>
          You don't need legacy apps disguised as AI.
          </p>
          <p className="text-lg mb-4">
          You need "real" AI that works now—AI that delivers real <br/> value to your enterprise today, no matter where you are <br/> on your digital transformation journey.
          </p>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <Image 
            src={normal} 
            alt="Revolutionary AI Technology" 
            width={500} 
            height={500}
            className="object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}