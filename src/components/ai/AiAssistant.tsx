import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Zap, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useAiStore } from '../../store/aiStore';
import { Message } from '../../types';

interface AiAssistantProps {
  dpiaId?: string;
  currentSection?: string;
  onPreFill?: (fieldId: string, value: string) => void;
  availableFields?: Array<{ id: string; label: string }>;
}

const AiAssistant: React.FC<AiAssistantProps> = ({
  dpiaId,
  currentSection,
  onPreFill,
  availableFields = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuthStore();
  const {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    preFillSuggestion,
    setPreFillSuggestion
  } = useAiStore();

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when assistant is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    
    await sendMessage({
      content: inputValue,
      role: 'user',
      dpiaId,
      section: currentSection
    });
    
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePreFill = (fieldId: string, content: string) => {
    if (onPreFill) {
      onPreFill(fieldId, content);
      setPreFillSuggestion(null);
    }
  };

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsExpanded(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Toggle button */}
      <Button
        variant="primary"
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-50"
        onClick={toggleAssistant}
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </Button>

      {/* Assistant panel */}
      <div 
        className={`fixed bottom-20 right-4 bg-white rounded-lg shadow-xl transition-all duration-300 z-40 flex flex-col
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
          ${isExpanded ? 'w-[600px] h-[80vh]' : 'w-[350px] h-[500px]'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium">AI Assistant</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleExpand}
              className="text-gray-500 hover:text-gray-700"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <button 
              onClick={() => clearMessages()}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Clear conversation"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <MessageSquare className="h-12 w-12 mb-2 text-gray-300" />
              <h4 className="text-lg font-medium mb-1">AI Assistant</h4>
              <p className="text-sm max-w-xs">
                Ask me questions about DPIA requirements or how to complete specific sections.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))
          )}
          
          {/* Pre-fill suggestion */}
          {preFillSuggestion && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
              <div className="flex items-start mb-2">
                <Zap className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Suggested content</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    I can pre-fill the following field with this content:
                  </p>
                </div>
              </div>
              <div className="bg-white rounded p-2 text-sm border border-blue-100 mb-2">
                {preFillSuggestion.content}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableFields.map(field => (
                  <Button
                    key={field.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreFill(field.id, preFillSuggestion.content)}
                    className="text-xs"
                  >
                    Fill "{field.label}"
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreFillSuggestion(null)}
                  className="text-xs"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 flex items-center">
                <Loader2 className="h-4 w-4 text-blue-600 animate-spin mr-2" />
                <span className="text-gray-600 text-sm">Thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-3 border-t">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the AI assistant..."
              className="w-full border rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={inputValue.trim() === '' || isLoading}
              className={`absolute right-2 bottom-2 p-1 rounded-full ${
                inputValue.trim() === '' || isLoading
                  ? 'text-gray-300'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <p>
              Powered by Claude AI. Your data is processed according to our privacy policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AiAssistant;
