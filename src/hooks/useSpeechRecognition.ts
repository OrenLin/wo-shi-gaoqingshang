import { useEffect, useState, useCallback } from 'react';

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // 检查浏览器是否支持语音识别
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      console.warn('当前浏览器不支持语音识别');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'zh-CN'; // 设置为中文

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const transcriptText = result[0].transcript;
      setTranscript(transcriptText);
    };

    recognition.onerror = (event: any) => {
      console.error('语音识别错误:', event.error);
      setIsListening(false);

      if (event.error === 'not-allowed') {
        alert('请允许使用麦克风以启用语音输入');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    // 开始识别
    try {
      recognition.start();
    } catch (error) {
      console.error('启动语音识别失败:', error);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    // 停止识别
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      // 创建一个新的实例来停止
      const recognition = new SpeechRecognition();
      recognition.stop();
    }

    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript
  };
}
