import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export default function Game() {
  const {
    getCurrentScene,
    submitAnswer,
    customInputs,
    setCustomInput
  } = useGameStore();

  const {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [showScene, setShowScene] = useState(false);

  const scene = getCurrentScene();

  useEffect(() => {
    const timer = setTimeout(() => setShowScene(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 重置状态
    setSelectedOption(null);
    setUseCustomInput(false);
    resetTranscript();
  }, [scene?.id, resetTranscript]);

  // 当语音识别有结果时，自动填充到输入框
  useEffect(() => {
    if (transcript && useCustomInput) {
      setCustomInput(scene?.id || '', transcript);
    }
  }, [transcript, useCustomInput, scene?.id, setCustomInput]);

  if (!scene) {
    return <div>场景加载中...</div>;
  }

  const handleSubmit = () => {
    if (useCustomInput) {
      const input = customInputs[scene.id] || '';
      if (input.trim()) {
        submitAnswer(scene.id, undefined, input);
      }
    } else if (selectedOption) {
      submitAnswer(scene.id, selectedOption);
    }
  };

  const handleToggleRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // 选项颜色（无等级标识，让用户盲选）
  const getOptionStyle = (optionId: string, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-white border-2 border-white shadow-xl scale-105';
    }
    return 'bg-white/90 border-2 border-white/30 hover:border-white hover:bg-white/95';
  };

  // 获取选项对应的emoji（选中后显示）
  const getOptionEmoji = (level: string) => {
    const emojiMap: Record<string, string> = {
      'anti': '🔥',
      'low': '💀',
      'medium': '😅',
      'high': '😎',
      'god': '👑'
    };
    return emojiMap[level] || '💭';
  };

  // 获取等级标签（选中后显示）
  const getLevelLabel = (level: string) => {
    const labelMap: Record<string, string> = {
      'anti': '抗压之王',
      'low': '低情商',
      'medium': '中情商',
      'high': '高情商',
      'god': '情商之神'
    };
    return labelMap[level] || '';
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景图片 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${scene.bgImage})`,
          transform: 'scale(1.05)',
        }}
      >
        {/* 渐变遮罩 - 让前景内容更清晰，同时保留背景图的氛围 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/60" />
      </div>

      {/* 内容区域 */}
      <div className="relative z-10 min-h-screen py-6 px-4">
        <div className="max-w-2xl mx-auto">
          {/* 场景标题 */}
          <div
            className={`text-center mb-6 transition-all duration-700 ${
              showScene ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="text-6xl mb-2 animate-bounce">{scene.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              {scene.title}
            </h2>
            <p className="text-white/80 text-lg">{scene.description}</p>
          </div>

          {/* 对话气泡 */}
          <div
            className={`bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl mb-6 transition-all duration-700 ${
              showScene ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* 人物头像 */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-4xl shadow-lg">
                  {scene.characters[0].emoji}
                </div>
                {/* 说话气泡动画 */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse">
                  <div className="absolute inset-0 bg-green-400 rounded-full animate-ping" />
                </div>
              </div>
              <div>
                <div className="font-bold text-gray-800 text-xl">
                  {scene.characters[0].name}
                </div>
                <div className="text-gray-500 text-sm">
                  {scene.characters[0].description}
                </div>
              </div>
            </div>

            {/* 对话内容 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 text-gray-700 leading-relaxed text-lg">
              {scene.triggerDialog}
            </div>
          </div>

          {/* 选项列表 */}
          <div
            className={`space-y-3 mb-6 transition-all duration-700 ${
              showScene ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white drop-shadow-lg">
                你会怎么回应？
              </h3>
              <button
                onClick={() => setUseCustomInput(!useCustomInput)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg ${
                  useCustomInput
                    ? 'bg-white text-purple-700'
                    : 'bg-white/30 text-white hover:bg-white/40 backdrop-blur-sm'
                }`}
              >
                ✍️ {useCustomInput ? '返回选项' : '自由发挥'}
              </button>
            </div>

            {useCustomInput ? (
              /* 自定义输入模式 */
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-2xl">
                <textarea
                  value={customInputs[scene.id] || ''}
                  onChange={(e) => setCustomInput(scene.id, e.target.value)}
                  placeholder="发挥你的情商，写下你的回复..."
                  className="w-full h-40 p-4 border-2 border-purple-200 rounded-xl
                             focus:border-purple-500 focus:outline-none resize-none text-lg"
                />
                <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                  <span>{(customInputs[scene.id] || '').length}/200 字</span>
                  {isSupported && (
                    <button
                      onClick={handleToggleRecording}
                      className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all shadow ${
                        isListening
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      🎤 {isListening ? '录音中...' : '语音输入'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* 预设选项模式 - 盲选版本 */
              <div className="space-y-3">
                {scene.options.map((option, index) => {
                  const isSelected = selectedOption === option.id;

                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelectedOption(option.id)}
                      className={`w-full text-left p-5 rounded-2xl transition-all duration-300
                                 ${getOptionStyle(option.id, isSelected)}`}
                      style={{
                        transitionDelay: `${index * 80}ms`
                      }}
                    >
                      <div className="flex items-start gap-4">
                        {/* 选项序号 */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                          ${isSelected ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-700'}`}>
                          {index + 1}
                        </div>

                        {/* 选项内容 */}
                        <div className="flex-1">
                          <div className="text-gray-800 text-lg leading-relaxed">
                            {option.content}
                          </div>

                          {/* 选中后显示等级 */}
                          {isSelected && (
                            <div className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold
                              ${option.level === 'anti' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : ''}
                              ${option.level === 'god' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : ''}
                              ${option.level === 'high' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' : ''}
                              ${option.level === 'medium' ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' : ''}
                              ${option.level === 'low' ? 'bg-gradient-to-r from-red-400 to-rose-500 text-white' : ''}
                            `}>
                              <span className="text-xl">{getOptionEmoji(option.level)}</span>
                              <span>{getLevelLabel(option.level)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 提交按钮 */}
          <div
            className={`transition-all duration-700 ${
              showScene ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <button
              onClick={handleSubmit}
              disabled={
                useCustomInput
                  ? !(customInputs[scene.id]?.trim())
                  : !selectedOption
              }
              className={`w-full py-5 rounded-2xl text-xl font-bold transition-all shadow-2xl ${
                useCustomInput
                  ? customInputs[scene.id]?.trim()
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:opacity-90'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : selectedOption
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:opacity-90'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {selectedOption || customInputs[scene.id]?.trim()
                ? '🎯 揭晓答案！'
                : '请选择一个回复'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
