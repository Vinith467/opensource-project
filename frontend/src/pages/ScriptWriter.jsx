import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, CheckCircle2, Sparkles, Wand2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ScriptWriter() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your AI Script Assistant. Paste your rough script or idea below, and I'll help you rewrite it to be more engaging, professional, or perfectly timed for your Avatar."
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Script copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Here is a polished and rewritten version of your script, optimized for video delivery:\n\n"Welcome everyone to today's update. ${userMessage.content.length > 20 ? 'As you know, ' + userMessage.content : 'We have some exciting news to share with you all today.'} By focusing on our core strengths, we can achieve remarkable results this quarter. Thank you for your continued dedication."\n\nHow does this sound? Would you like me to make it more energetic or keep it professional?`
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500); // 1.5 second delay
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-purple-600 p-2 rounded-lg">
          <Wand2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">AI Script Rewriter</h1>
          <p className="text-gray-400 text-sm">Perfect your video script before generation</p>
        </div>
      </div>

      <div className="flex-1 bg-[#111] rounded-2xl border border-[#222] shadow-sm flex flex-col overflow-hidden relative">
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex space-x-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-[#222]' : 'bg-purple-600/20 border border-purple-500/30'}`}>
                    {msg.role === 'user' ? <User className="w-5 h-5 text-gray-300" /> : <Bot className="w-5 h-5 text-purple-400" />}
                  </div>
                </div>

                {/* Message Bubble */}
                <div className={`group relative p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#222] text-white rounded-tr-sm' 
                    : 'bg-transparent border border-[#222] text-gray-200 rounded-tl-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  
                  {/* Copy Button (Only for AI) */}
                  {msg.role === 'assistant' && msg.id !== 1 && (
                    <button 
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="absolute top-2 right-2 p-1.5 bg-[#1a1a1a] border border-[#333] rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#222] text-gray-400 hover:text-white"
                      title="Copy Script"
                    >
                      {copiedId === msg.id ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-[80%]">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-transparent border border-[#222] text-gray-400 rounded-tl-sm flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#0a0a0a] border-t border-[#222]">
          <form onSubmit={handleSubmit} className="relative flex items-end bg-[#1a1a1a] border border-[#333] rounded-2xl focus-within:border-purple-500 transition-colors overflow-hidden">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste your script here to have the AI rewrite it... (Shift+Enter for new line)"
              className="w-full max-h-32 bg-transparent text-white placeholder-gray-500 p-4 outline-none resize-none overflow-y-auto text-sm"
              rows="1"
              style={{ minHeight: '56px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="mb-2 mr-2 p-2 bg-purple-600 hover:bg-purple-500 disabled:bg-[#333] disabled:text-gray-500 text-white rounded-xl transition-colors flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-center mt-3">
             <p className="text-xs text-gray-600">AI can make mistakes. Review the script before generating your video.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
