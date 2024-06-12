const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { AssemblyAI } = require('assemblyai');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors()); // Enable CORS for all routes

const client = new AssemblyAI({
    apiKey: '687063c7417345c4b8de68a676b60714'
});

const audioUrl = './uploads/returned_audio.mp3';

const params = {
    audio: audioUrl,
    speaker_labels: true
};

const run = async () => {
    const transcript = await client.transcripts.transcribe(params);
    return transcript.text;
};

// Acknowledgment endpoint
app.get('/acknowledgment', (req, res) => {
    res.json({ status: 'running' });
});

app.get('/try', async (req, res) => {
    const ans = await run();
    console.log(ans);
    res.send("okay");
});

app.post('/upload', upload.single('video'), async (req, res) => {
    const filePath = path.join(__dirname, req.file.path);

    // Prepare the form data
    const formData = new FormData();
    formData.append('video', fs.createReadStream(filePath), req.file.originalname);

    try {
        console.log('Sending request to Flask server...');
        const response = await axios.post('https://beta-nod.onrender.com', formData, {
            headers: formData.getHeaders(),
            responseType: 'stream',  // Important to handle the returned file as a stream
            timeout: 300000  // Timeout set to 5 minutes (300,000 ms)
        });

        // Define the path to save the returned audio file
        const audioFilePath = path.join(__dirname, 'uploads', 'returned_audio.mp3');

        // Create a write stream to save the returned audio file
        const writer = fs.createWriteStream(audioFilePath);
        response.data.pipe(writer);

        // Handle the finish and error events
        writer.on('finish', async () => {
            console.log('Audio file saved successfully.');
            try {
                // Send a request to the Flask server to delete the video and audio files
                const deleteResponse = await axios.post('https://beta-nod.onrender.com/delete');
                console.log('Files deleted successfully on Flask server:', deleteResponse.data);
            } catch (deleteError) {
                console.error('Error deleting files on Flask server:', deleteError);
            }

            const conv = await run();
            res.status(200).json({
                status: 'Audio file saved and files deleted successfully.',
                transcript: conv
            });

            // Delete the audio file asynchronously after response is sent
            fs.unlink(audioFilePath, (err) => {
                if (err) {
                    console.error('Error deleting audio file:', err);
                } else {
                    console.log('Audio file deleted successfully.');
                }
            });
        });

        writer.on('error', (error) => {
            console.error('Error saving audio file:', error);
            res.status(500).send('Error saving audio file');
        });
    } catch (error) {
        console.error('Error uploading video to Flask server:', error);
        res.status(500).send('Error uploading video to Flask server');
    } finally {
        // Cleanup the uploaded file
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting uploaded video file:', err);
            } else {
                console.log('Uploaded video file deleted successfully.');
            }
        });
    }
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});