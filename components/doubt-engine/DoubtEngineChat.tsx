'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquareQuote,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  ShieldAlert,
  Sparkles,
  Bot,
  User,
  HelpCircle,
} from 'lucide-react';
import { CandidateExtractionRow, DoubtEngineMessage } from '@/lib/types/report.types';
import { answerDoubtQuery } from '@/lib/services/doubt-engine-service';

interface Props {
  reportContext: CandidateExtractionRow[];
}

export function DoubtEngineChat({ reportContext }: Props) {
  const [messages, setMessages] = useState<DoubtEngineMessage[]>([
    {
      id: 'init_1',
      sender: 'assistant',
      text: 'Namaste! I am your SaarthiAI Doubt Engine. I can help explain medical terms, laboratory units, and report fields in simple English or Hindi. What would you like to clarify?',
      timestamp: 'Just now',
      language: 'en',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [speechSynthesisActive, setSpeechSynthesisActive] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check Web Speech API Support on Client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setVoiceSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSpeakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speechSynthesisActive) {
      window.speechSynthesis.cancel();
      setSpeechSynthesisActive(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setSpeechSynthesisActive(false);
    utterance.onerror = () => setSpeechSynthesisActive(false);

    setSpeechSynthesisActive(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: DoubtEngineMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: lang,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Answer grounded query
    const res = answerDoubtQuery(query, reportContext, lang);
    setMessages((prev) => [...prev, res.message]);

    // Read answer out loud if user previously used voice
    if (isListening) {
      handleSpeakText(res.message.text);
    }
  };

  const quickPrompts = lang === 'hi'
    ? [
        'मेरी रिपोर्ट में mg/dL का क्या मतलब है?',
        'हीमोग्लोबिन क्या काम करता है?',
        'डॉक्टर से पूछने के लिए प्रश्न सुझाएं',
      ]
    : [
        'What does mg/dL mean on my report?',
        'What is Hemoglobin measuring?',
        'Suggest questions for my doctor consultation',
      ];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 shadow-2xl flex flex-col h-[600px] overflow-hidden">
      {/* Top Header Bar */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>Saarthi Doubt Engine</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                Safe Q&amp;A
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Grounded in {reportContext.length} parameters &bull; Zero medical diagnoses
            </p>
          </div>
        </div>

        {/* Language & Voice Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700"
          >
            {lang === 'en' ? 'हिन्दी में पूछें' : 'English'}
          </button>
        </div>
      </div>

      {/* Safety Policy Banner */}
      <div className="bg-amber-950/30 border-b border-amber-950/60 px-4 py-2 flex items-center space-x-2 text-[11px] text-amber-200">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          Educational Q&amp;A only. Requests for diagnoses, prescriptions, or dosages will be safely declined.
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser ? 'bg-sky-600 text-white' : 'bg-slate-800 text-sky-400'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-sm ${
                  isUser
                    ? 'bg-sky-600 text-white rounded-tr-none'
                    : msg.isRefusal
                    ? 'bg-amber-950/60 text-amber-200 border border-amber-800/80 rounded-tl-none'
                    : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div className="flex items-center justify-between text-[10px] opacity-70 pt-1 border-t border-white/10">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleSpeakText(msg.text)}
                      title="Read out loud"
                      className="hover:opacity-100 flex items-center space-x-1"
                    >
                      {speechSynthesisActive ? (
                        <VolumeX className="w-3 h-3 text-red-400" />
                      ) : (
                        <Volume2 className="w-3 h-3" />
                      )}
                      <span>Voice</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="px-4 py-2 bg-slate-950/70 border-t border-slate-800/80 flex flex-wrap gap-2">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="text-[11px] text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 px-3 py-1 rounded-full transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box Bar */}
      <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
        {voiceSupported && (
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl transition-colors ${
              isListening
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-sky-400" />}
          </button>
        )}

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder={
            isListening
              ? 'Listening to speech...'
              : lang === 'hi'
              ? 'रिपोर्ट या किसी मेडिकल शब्द के बारे में पूछें...'
              : 'Ask a question about a term, unit, or range...'
          }
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim()}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
