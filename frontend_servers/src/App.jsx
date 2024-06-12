import { useState , useEffect , useContext } from 'react'
import reactLogo from './assets/react.svg'
import { Container, CssBaseline, Typography } from '@mui/material';
import viteLogo from '/vite.svg'
import './App.css'
import CSR from './Process'
import DU from './Uploader'
import { curr_context } from './VideoSrc';
import axios from 'axios'; 
import { GoogleGenerativeAI } from "@google/generative-ai" ;

function App() {
  const [state , setstate] = useState(0) ; 
  const [load , setload] = useState(false) ; 
  const now_context = useContext(curr_context) ; 
  
  const genAI = new GoogleGenerativeAI("AIzaSyC2w_s0gzTC5bNkDeiOnloUdKf7RAIIlbM");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  async function gen( proc ) {
    const prompt = proc + "\n" + "Write summar from above text ."
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text ; 
  }

  const [trans , set_trans] = useState() ; 




  useEffect(() => {


    if (now_context.vsrc) {
    setload(true) ; 
    async function run(){
      console.log(now_context.vsrc);
      const ack_node = axios.get("https://beta-2-1.onrender.com/acknowledgment")
      const ack_flask = await axios.post("https://beta-nod.onrender.com/acknowledgment")
      .then(async (res)=>{
        if(res.data.status == "running"){
          console.log(res.data.status == "running")
          const ack_node = axios.get("https://beta-2-1.onrender.com/acknowledgment")
          .then(async (res)=>{
            if(res.data.status == "running"){
              console.log(res.data.status == "running")
              setstate(1)
              setTimeout(() => {
                setstate(2);
              }, 1000); // 1000 milliseconds = 1 second
              if (now_context.vsrc) {
                fetch(now_context.vsrc)
                  .then(response => response.blob())
                  .then(blob => {
                    const formData = new FormData();
                    formData.append('video', blob, 'video.mp4');
                    console.log(blob);
                    axios.post('https://beta-2-1.onrender.com/upload', formData)
                      .then(async (response) => {
                        console.log('Video uploaded successfully:', response.data);
                        setTimeout(() => {
                          setstate(3);
                        }, 2000); // 2000 milliseconds = 2 seconds
                        setTimeout(() => {
                          setstate(4);
                        }, 3000); 
                        setTimeout(() => {
                          setstate(5);
                        }, 1000);
                        const ans = await gen(response.data.transcript) ; 
                       
                  
                      })
                      .catch(error => {
                        setTimeout(() => {
                          setstate(6);
                        }, 1000);
                        setTimeout(() => {
                          setstate(7);
                        }, 1000);
                        console.log(ans) ; 
                        set_trans(ans) ; 
                        set_trans(response.data.transcript)
                        console.error('Error uploading video:', error);
                        // Log the entire error object for debugging
                        console.log('Full error object:', error);
                        // Handle error if needed
                      });
                  })
                  .catch(error => {
                    console.error('Error fetching Blob:', error);
                    // Handle fetch error if needed
                  });


              }
            }
          })






        }
   
      })

  
  
  

    }


     run() ;
  }



  }, [now_context.vsrc]);


  return (
    <>
     
    <div className='flex flex-wrap w-[94vw] h-[90vh] mt-[1vh]'>
    <h1 className='w-[100vw] mb-[2vh] text-[5vh] text-bold '> 
         AI Summariser 
        </h1>
    <div className='w-[94vw] h-[25vh] flex justify-center items-center mt-[2vh] mb-[4vh] backdrop-blur-xl bg-white/40 rounded-lg shadow-lg border-2'>
    <CSR  temprature = {state} />
      </div>    


       <div className='flex justify-between w-[96vw] mb-[2vh]'>
       <CssBaseline />
       <div >
       <Typography variant="h4" component="h1" gutterBottom>
        File Uploader
      </Typography>
      <DU />
       </div>
        <div>
        <Typography variant="h4" component="h1" gutterBottom>
        Summary 
        </Typography>
          <div className=' flex justify-center items-center h-[70vh] w-[30vw]  rounded-xl backdrop-blur-xl bg-white/40 rounded-lg shadow-lg border-2'>
          {
            trans ? (  <div className='w-[26vw] h-[66vh] overflow-y-scroll text-left' style={{ scrollbarColor: 'white', WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)' }}>
              {trans}
            </div>) : 
            <>
              {load && <div className='loader mr-2'/>}
            </>
          }
          </div>       
        </div>

       </div>
       <div className='h-[6vh] w-[90vw]'/>
    </div>


    
    </>
  )
}

export default App
