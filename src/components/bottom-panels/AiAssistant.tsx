import React, { useState } from 'react';
import { Send, Mic, Sparkles, Bot, User } from 'lucide-react';
import { ChatMessage } from '../../state/useClimateStore';

interface AiAssistantProps {
  chatMessages: ChatMessage[];
  isAiTyping: boolean;
  onSendMessage: (msg: string) => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  chatMessages,
  isAiTyping,
  onSendMessage,
}) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onSendMessage(inputVal);
    setInputVal('');
  };

  // Get last user query and last AI response for the primary display view
  const lastUserMsg = [...chatMessages].reverse().find(m => m.sender === 'user');
  const lastAiMsg = [...chatMessages].reverse().find(m => m.sender === 'ai');

  return (
    <div className="rounded-xl bg-[#09173a]/80 border border-[#00f0ff]/20 p-2 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-1">
        <div className="w-5 h-5 rounded-md bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
          <Bot className="w-3.5 h-3.5" />
        </div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-100 font-display">
          AI CLIMATE ASSISTANT
        </h2>
      </div>

      {/* Primary Question / Answer Display matching reference UI */}
      <div className="space-y-2 my-1 flex-1 flex flex-col justify-center">
        {/* User Question Capsule */}
        <div className="flex items-start justify-start">
          <div className="px-2.5 py-1 rounded-full bg-[#14234b] border border-[#00f0ff]/30 text-[10px] font-medium text-white shadow-sm max-w-[90%]">
            {lastUserMsg ? lastUserMsg.text : 'Why is rainfall decreasing in Telengana?'}
          </div>
        </div>

        {/* AI Answer Text */}
        <div className="p-1 rounded-lg bg-[#071330]/80 border border-white/5 text-[9px] text-slate-300 leading-tight">
          {isAiTyping ? (
            <div className="flex items-center space-x-2 text-cyan-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Analyzing multi-layer climate telemetry...</span>
            </div>
          ) : (
            <p className="line-clamp-3 overflow-hidden">
              {lastAiMsg
                ? lastAiMsg.text
                : 'Rainfall is decreasing mainly due to rising temperatures, erratic monsoon patterns, land use changes and reduced vegetation cover. Models predict a further 12% decrease by 2030 if current trends continue.'}
            </p>
          )}
        </div>
      </div>

      {/* Input Bar with Mic and Send Button matching reference */}
      <form onSubmit={handleSubmit} className="relative mt-1">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask anything about climate..."
          className="w-full bg-[#071330] border border-[#00f0ff]/25 rounded-md px-1.5 py-1 pr-12 text-[9px] text-white placeholder-slate-500 focus:outline-none focus:border-[#00f0ff] font-sans"
        />
        <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          <button
            type="button"
            title="Voice input"
            className="p-1 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>
          <button
            type="submit"
            title="Send query"
            className="p-1 rounded bg-[#00f0ff] text-slate-950 hover:bg-cyan-300 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
