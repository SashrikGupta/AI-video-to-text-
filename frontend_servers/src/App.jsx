import { useState, useEffect, useContext } from 'react';
import { Container, CssBaseline, Typography } from '@mui/material';
import axios from 'axios'; 
import { IoIosSend } from 'react-icons/io';
import { curr_context } from './VideoSrc';
import CSR from './Process';
import DU from './Uploader';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './App.css';
import {marked} from 'marked';
function App() {
  const [state, setState] = useState(0);
  const [load, setLoad] = useState(false);
  const now_context = useContext(curr_context);
  const [trans, setTrans] = useState('');
  const [full , set_full] = useState('hi ') ; 
  const [chat, setChat] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loady , setloady] = useState(false) ; 
  const genAI = new GoogleGenerativeAI("AIzaSyC2w_s0gzTC5bNkDeiOnloUdKf7RAIIlbM");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  async function gen(prompt) {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  }

  useEffect(() => {
    if (now_context.vsrc) {
      setLoad(true);
      async function run() {
        console.log(now_context.vsrc);
        const ack_node = axios.get("https://beta-2-1.onrender.com/acknowledgment");
        const ack_flask = await axios.post("https://beta-nod.onrender.com/acknowledgment")
          .then(async (res) => {
            if (res.data.status === "running") {
              console.log(res.data.status === "running");
              const ack_node = axios.get("https://beta-2-1.onrender.com/acknowledgment")
                .then(async (res) => {
                  if (res.data.status === "running") {
                    console.log(res.data.status === "running");
                    setState(1);
                    setTimeout(() => {
                      setState(2);
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
                                setState(3);
                              }, 2000); // 2000 milliseconds = 2 seconds
                              setTimeout(() => {
                                setState(4);
                              }, 3000); 
                              setTimeout(() => {
                                setState(5);
                              }, 1000);
                              set_full(response.data.transcript) ;
                              const ans = await gen(response.data.transcript); 
                              setChat(()=>{
                                return [...chat, { cont: ans, ai: true }];
                              })
                              console.log(ans); 
                              setTrans(ans); 
                              setTimeout(() => {
                                setState(6);
                              }, 1000);
                              setTimeout(() => {
                                setState(7);
                              }, 1000);
                            })
                            .catch(error => {
                              setTimeout(() => {
                                setState(6);
                              }, 1000);
                              setTimeout(() => {
                                setState(7);
                              }, 1000);
                              setTrans(response.data.transcript);
                              console.error('Error uploading video:', error);
                            });
                        })
                        .catch(error => {
                          console.error('Error fetching Blob:', error);
                        });
                    }
                  }
                });
            }
          });
      }
      run();
    }
  }, [now_context.vsrc]);

  useEffect(()=>{
    console.log(loady)
  } , [loady])

  const chat_handler = async () => {
    if (userInput.trim() === '') return;

    const newChat = [...chat, { cont: userInput, ai: false }];
    setChat(newChat);
    setUserInput('');

    const prompt = full + "\nUser: " + userInput + "\nAI:";
    setloady(true) ;
    const aiResponse = await gen(prompt);
    setloady(false) ; 
    setChat([...newChat, { cont: aiResponse, ai: true }]);
  };

  return (
    <>
      <div className='flex flex-wrap w-[94vw] h-[90vh] mt-[1vh]'>
        <h1 className='w-[100vw] mb-[2vh] text-[5vh] text-bold'> 
          AI video decoder
        </h1>
        <div className='w-[94vw] h-[25vh] flex justify-center items-center mt-[2vh] mb-[4vh] backdrop-blur-xl bg-white/40 rounded-lg shadow-lg border-2'>
          <CSR temprature={state} />
        </div>    

        <div className='flex justify-between w-[96vw] mb-[2vh]'>
          <CssBaseline />
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              File Uploader
            </Typography>
            <DU />
          </div>
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              A.I 
            </Typography>
            <div className='flex justify-center items-center h-[70vh] w-[30vw] rounded-xl backdrop-blur-xl bg-white/40 rounded-lg shadow-lg border-2'>
              {chat[0] ? (
                <div>
                  <div className='w-[26vw] h-[60vh] overflow-y-scroll text-left' style={{ scrollbarColor: 'white', WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)' }}>
                    {chat.map((el, index) => (
                      <div key={index}>
                        {el.ai ? (
                          <div style={{background: "linear-gradient(45deg, pink, violet, pink)"}} className='w-[20vw] pl-2 m-2 rounded-md' dangerouslySetInnerHTML={{ __html: marked(el.cont)}}>
                            
                          </div>
                        ) : (
                          <div className='w-[24vw] flex-col items-end'>
                            <div className='flex w-[24vw]'>
                            <div className='w-[4vw]'></div>
                            <div className='w-[20vw] pl-2 m-2 rounded-md bg-black/10'>
                              {el.cont}
                            </div>
                            </div>
                            {
                          (loady && index==chat.length-1) ? (<>
                          <div className='loader'> </div>
                          </>) : <></>
                        }
                          </div>
                          
                        )}

                      </div>
                      
                    ))}
                  </div>
                  <div className='flex'>
                    <input 
                      id="ok" 
                      className='w-[22vw] mt-3 h-[4vh] bg-white/50 rounded-md'
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                    />
                    <div>
                      <button 
                        onClick={chat_handler} 
                        style={{background: "linear-gradient(45deg, pink, violet, pink)"}} 
                        className='flex text-[4vh] justify-center items-center w-[3vw] mt-3 ml-[1vw] h-[4vh] rounded-lg'
                      >
                        <IoIosSend/>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {load && <div className='loader mr-2'/>}
                </>
              )}
            </div>       
          </div>
        </div>
        <div className='h-[6vh] w-[90vw]'/>
      </div>
    </>
  );
}

export default App;
