// src/components/DropzoneUploader.js

import React, { useCallback, useState  , useContext, useEffect} from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { curr_context } from './VideoSrc';
import {  Backdrop } from "@mui/material";


const DU = () => {

  const now_context = useContext(curr_context) ; 
  const [videoSrc, setVideoSrc] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  }, []);

  useEffect(()=>{
    now_context.set_vsrc(videoSrc)
  } , [videoSrc])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'video/*'
  });
    // height : "calc(50vw * 0.5625)"
    return (
      <Paper 
        {...getRootProps()}
        sx={{
         padding: "20px" ,
         textAlign: "center",
         display: "flex" , 
         flexWrap: "wrap" ,
         justifyContent: "center" ,
         borderRadius: "4px" ,
         cursor: "pointer" , 
         width: "60vw" , 
         height: "calc(70vh)" ,
         backgroundColor: "rgba(255, 255, 255, 0.4)", /* Semi-transparent white background */
         backdropFilter: "blur(20px)" , /* Apply blur effect */
        }}
        className='backdrop-blur-xl bg-white/40 rounded-lg shadow-lg border-2'
      >
        <input {...getInputProps()} />
        {!videoSrc &&
        <Box>
          <CloudUploadIcon sx={{ fontSize: 50, color: '#9e9e9e' }} />
          <Typography variant="h6" color="textSecondary">
            {isDragActive ? 'Drop the files here ...' : 'Drag & drop some files here, or click to select files'}
          </Typography>
          <Button variant="contained" color="primary" sx={{ marginTop: '10px' }}>
            Browse Files
          </Button>
        </Box>
        }
  
        {videoSrc && (
          <Box  >
            <video style = {{width : "50vw" , height : "60vh"  , display : "flex" }} controls>
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        )}
      </Paper>
    );
  };
  
  export default DU;;

