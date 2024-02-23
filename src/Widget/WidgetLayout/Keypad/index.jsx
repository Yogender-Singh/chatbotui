import React, { useEffect } from 'react';
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { createUserMessage } from "../../../utils/helpers";
import AppContext from "../../AppContext";
import { RecordAudio } from "../../../utils/audioRecorder";
import { sendAudioToServer } from "../../../utils/sendAudio";
import {
  addMessage,
  fetchBotResponse,
  toggleBotTyping,
  toggleUserTyping,
} from "../Messages/messageSlice";

const Textarea = styled.textarea`
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Keypad = () => {
  const dispatch = useDispatch();
  const theme = useContext(AppContext);
  const [userInput, setUserInput] = useState("");
  const userTypingPlaceholder = useSelector(
    (state) => state.messageState.userTypingPlaceholder
  );

  const userTyping = useSelector((state) => state.messageState.userTyping);
  const {  rasaServerUrl, userId, textColor } = theme;
  const [serverResponse, setServerResponse] = useState(null);
  const [statusText, setStatusText] = useState('Start Recording');
  const { audioBlob, toggleRecording, recording } = RecordAudio();
  useEffect(() => {
    // Send to server when recording stops 
    if (!recording && audioBlob) {
      const sendRecording = async () => {
        try {
          const response = await sendAudioToServer(audioBlob);
          console.log(response)
          setServerResponse(response);
        } catch (error) {
          console.error('Error:', error);
        }
      };

      sendRecording();
      
    }
  }, [audioBlob]);

  useEffect(() => {
    if (serverResponse) {
      if (serverResponse !==null) {
        dispatch(addMessage(createUserMessage(serverResponse.trim())));
        setUserInput("");
        dispatch(toggleUserTyping(false));
        dispatch(toggleBotTyping(true));
        dispatch(
          fetchBotResponse({
            rasaServerUrl,
            message: serverResponse.trim(),
            sender: userId,
          })
        );
      }// Process serverResponse and do something based on it
    }
    setServerResponse(null);
  }, [serverResponse]); // Triggers when serverResponse changes

  const handleSubmit = async () => {
    if (userInput.length > 0) {
      dispatch(addMessage(createUserMessage(userInput.trim())));
      setUserInput("");
      dispatch(toggleUserTyping(false));
      dispatch(toggleBotTyping(true));
      dispatch(
        fetchBotResponse({
          rasaServerUrl,
          message: userInput.trim(),
          sender: userId,
        })
      );
    }
  };
  const handleSpeechSubmit = async () => {
    
    setStatusText('Sending...');
    toggleRecording();  // Toggle recording (Start or Stop)
  };

  return (
    <div className="mt-auto flex  h-[12%] items-center   rounded-t-3xl rounded-b-[2rem]  bg-slate-50">
      <Textarea
        rows="1"
        className={` mx-4 block w-full resize-none bg-slate-50 p-2.5 text-sm text-gray-900 outline-none ${
          userTyping ? "cursor-default" : "cursor-not-allowed"
        }`}
        placeholder={userTypingPlaceholder}
        value={userInput}
        onChange={(e) => {
          setUserInput(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
        readOnly={!userTyping}
      />
      <button
        type="submit"
        className={`${
          "cursor-default" 
        } inline-flex justify-center rounded-full  p-2 hover:bg-slate-100 `}
        style={{ color: textColor }}
        onClick={(e) => {
          handleSpeechSubmit();
        }}
      >
        {recording ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm5-2.25A.75.75 0 0 1 7.75 7h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.5Z" clipRule="evenodd" />
        </svg>
        
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path d="M7 4a3 3 0 0 1 6 0v6a3 3 0 1 1-6 0V4Z" />
          <path d="M5.5 9.643a.75.75 0 0 0-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-1.5v-1.546A6.001 6.001 0 0 0 16 10v-.357a.75.75 0 0 0-1.5 0V10a4.5 4.5 0 0 1-9 0v-.357Z" />
          </svg>
        )}
          

      </button>

      <button
        type="submit"
        className={`${
          userInput.trim().length > 1 ? "cursor-default" : "cursor-not-allowed"
        } inline-flex justify-center rounded-full  p-2 hover:bg-slate-100 `}
        style={{ color: textColor }}
        onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        

        <PaperAirplaneIcon className="h-6 w-6 -rotate-45 stroke-[1.1px]" />
      </button>
    </div>
  );
};
