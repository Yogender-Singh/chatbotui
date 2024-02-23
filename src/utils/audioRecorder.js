import { useState, useEffect, useRef } from 'react';

export const RecordAudio = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const recorderRef = useRef(null);
  const audioType = 'audio/webm'; // Or 'audio/wav' 

  useEffect(() => {
    const setupRecorder = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!MediaRecorder.isTypeSupported(audioType)) {
        console.warn(`${audioType} format not supported`);
        return; 
      }

      recorderRef.current = new MediaRecorder(stream, { mimeType: audioType });

      recorderRef.current.ondataavailable = (e) => {
        setAudioBlob(e.data);
      };
    };

    setupRecorder();
  }, []);

  const toggleRecording = () => {
    if (recording) {
      recorderRef.current.stop();
    } else {
      recorderRef.current.start();
    }
    setRecording(!recording);
  };

  return { audioBlob, toggleRecording, recording };
};
