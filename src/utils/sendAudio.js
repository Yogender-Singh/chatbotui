import axios from 'axios';

export const sendAudioToServer = async (audioBlob) => {
  const formData = new FormData();
  formData.append('audio_file', audioBlob, 'recording.webm');

  try {
    const response = await axios.post('http://0.0.0.0:5317/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      }
    });
    console.log('response from server:', response.data.text);
    return response.data.text; // Assuming your server returns data
  } catch (error) {
    console.error('Error sending audio or processing response:', error);
    throw error; 
  }
};
