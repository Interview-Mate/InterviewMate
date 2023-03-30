import { useEffect, useRef, useState, useContext } from "react";
import * as ApiService from "../Util/ApiService";

export default function SpeechToText({
  isInterviewerSpeaking,
  onSaveUserResponse,
  video,
  interviewEnd,
}: SpeechProps) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const audioChunks = useRef<Blob[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState<string>("");
  const speechRecognition = useRef(
    new (window.SpeechRecognition || window.webkitSpeechRecognition)()
  );

  speechRecognition.current.interimResults = true;
  speechRecognition.current.continuous = true;

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.addEventListener("dataavailable", (event) => {
        audioChunks.current.push(event.data);
      });
    });

    speechRecognition.current.addEventListener("result", (event: any) => {
      let newTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        newTranscript += event.results[i][0].transcript;
      }
      setCurrentTranscript(newTranscript);
    });

    speechRecognition.current.addEventListener("end", () => {
      if (recording) {
        speechRecognition.current.start();
      }
    });
  }, []);

  const startRecording = () => {
    setRecording(true);
    speechRecognition.current.start();
    mediaRecorder?.start();
  };

  const turnOffAudioInput = () => {
    speechRecognition.current.stop();
    mediaRecorder?.stop();
  };

  const punctuateText = async (currentTranscript: string) => {
    const response = await ApiService.punctuate(currentTranscript);
    const punctuatedText: string = response.punctuatedText;
    return punctuatedText;
  };

  const createAudioFile = async () => {
    const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
    const id = Math.random().toString(36).substr(2, 9);
    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append(
      "upload_preset",
      `${process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET}`
    );
    return formData;
  };

  const postAudioFile = async (formData: any) => {
    const cloudinaryResponse = await ApiService.postAudio(formData);
    return cloudinaryResponse;
  };

  const stopRecording = async () => {
    turnOffAudioInput();
    const punctuatedText = await punctuateText(currentTranscript);
    const formData = await createAudioFile();
    const audioFile = await postAudioFile(formData);
    const audioUrl = audioFile.data.url;
    audioChunks.current = [];
    setRecording(false);
    onSaveUserResponse(audioUrl, punctuatedText);
    setCurrentTranscript("");
  };

  const onTextSubmit = async () => {
    onSaveUserResponse(null, currentTranscript);
    setCurrentTranscript("");
  };

  if (!video) {
    return (
      <div>
        <div className="chat-input-container">
          <textarea
            className="chat-input"
            value={currentTranscript}
            onChange={(e) => setCurrentTranscript(e.target.value)}
            placeholder="Type your answer here..."
            disabled={isInterviewerSpeaking}
          />
          <button
            className={`chat-send-button ${
              isInterviewerSpeaking ? "disabled" : ""
            }`}
            onClick={onTextSubmit}
            disabled={isInterviewerSpeaking}
          >
            Send
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-center">
        <button
          className="w-fit py-2 px-4 mr-5 bg-dark-cyan text-black font-bold text-black hover:bg-african-violet-900 hover:text-seasalt rounded-md px-3 py-2 text-base font-medium disabled:bg-eerie-black disabled:text-seasalt"
          onClick={startRecording}
          disabled={recording || isInterviewerSpeaking}
        >
          Record
        </button>

        <button
          className="w-fit py-2 px-4 bg-dark-cyan text-black font-bold text-black hover:bg-african-violet-900 hover:text-seasalt rounded-md px-3 py-2 text-base font-medium disabled:bg-eerie-black disabled:text-seasalt"
          onClick={stopRecording}
          disabled={!recording}
        >
          Stop
        </button>
      </div>
    </div>
  );
}
