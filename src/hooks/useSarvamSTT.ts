import { useRef, useState } from "react";

type Status = "idle" | "recording" | "processing" | "error";

const SILENCE_THRESHOLD = 15;
const SILENCE_DURATION_MS = 1300;

export function useSarvamSTT() {
  const [status, setStatus] = useState<Status>("idle");
  const [transcript, setTranscript] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const mimeTypeRef = useRef<string>("audio/webm");
  const audioContextRef = useRef<AudioContext | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const speechDetectedRef = useRef(false);

  const stopSilenceDetection = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    audioContextRef.current?.close();
    audioContextRef.current = null;
    rafRef.current = null;
    silenceTimerRef.current = null;
    speechDetectedRef.current = false;
  };

  const startSilenceDetection = (
    stream: MediaStream,
    onSilence: () => void,
  ) => {
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const check = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      if (avg > SILENCE_THRESHOLD) {
        speechDetectedRef.current = true;
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      } else if (speechDetectedRef.current && !silenceTimerRef.current) {
        silenceTimerRef.current = setTimeout(onSilence, SILENCE_DURATION_MS);
      }

      rafRef.current = requestAnimationFrame(check);
    };

    rafRef.current = requestAnimationFrame(check);
  };

  const sendAudio = async (chunks: Blob[]) => {
    setStatus("processing");

    const mimeType = mimeTypeRef.current;
    const ext = mimeType.includes("mp4") ? "mp4" : "webm";
    const audioBlob = new Blob(chunks, { type: mimeType });
    const formData = new FormData();
    formData.append("audio", audioBlob, `audio.${ext}`);

    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTranscript(data.transcript ?? "");
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  const startRecording = async (deviceId?: string) => {
    try {
      const audioConstraints: MediaTrackConstraints = {
        echoCancellation: true,
        autoGainControl: true,
      };
      if (deviceId) {
        audioConstraints.deviceId = { exact: deviceId };
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
      });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      mimeTypeRef.current = mimeType;

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stopSilenceDetection();
        sendAudio(chunksRef.current);
        streamRef.current?.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setStatus("recording");

      startSilenceDetection(stream, () => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      });
    } catch {
      setStatus("error");
    }
  };

  const stopRecording = () => {
    stopSilenceDetection();
    mediaRecorderRef.current?.stop();
  };

  const resetTranscript = () => setTranscript("");

  return { status, transcript, startRecording, stopRecording, resetTranscript };
}
