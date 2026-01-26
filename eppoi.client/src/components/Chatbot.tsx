import { useState, useCallback, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, MessageSquarePlus, RefreshCw } from 'lucide-react';
import { type ChatMessage, ApiErrorWithResponse } from '../api/apiUtils';
import { askChatBot } from '../api/chatbotApi';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const suggestedQuestions = [
  { emoji: '💡', text: 'Cosa posso visitare a Cupra Marittima?' },
  { emoji: '🍝', text: 'Dove posso mangiare cibo tradizionale?' },
  { emoji: '🗺️', text: 'Ci sono degli itinerari consigliati in zona?' },
];

/**
 * Markdown-like response text formatting
 * Handles: ### headers, **bold**, *italic*, lists (* or -), and \n for newlines
 */
function formatMessageText(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  
  const parseInline = (content: string, keyPrefix: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remaining = content;
    let partIndex = 0;

    while (remaining.length > 0) {
      // Find **bold** first
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      // Find *italic* (but not **)
      const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);

      const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : -1;
      const italicIndex = italicMatch ? remaining.indexOf(italicMatch[0]) : -1;

      if (boldIndex === -1 && italicIndex === -1) {
        parts.push(<span key={`${keyPrefix}-${partIndex++}`}>{remaining}</span>);
        break;
      }

      let matchIndex: number;
      let matchLength: number;
      let matchContent: string;
      let isBold: boolean;

      if (boldIndex !== -1 && (italicIndex === -1 || boldIndex <= italicIndex)) {
        matchIndex = boldIndex;
        matchLength = boldMatch![0].length;
        matchContent = boldMatch![1];
        isBold = true;
      } else {
        matchIndex = italicIndex;
        matchLength = italicMatch![0].length;
        matchContent = italicMatch![1];
        isBold = false;
      }

      if (matchIndex > 0) {
        parts.push(<span key={`${keyPrefix}-${partIndex++}`}>{remaining.substring(0, matchIndex)}</span>);
      }

      if (isBold) {
        parts.push(<strong key={`${keyPrefix}-${partIndex++}`}>{matchContent}</strong>);
      } else {
        parts.push(<em key={`${keyPrefix}-${partIndex++}`}>{matchContent}</em>);
      }

      remaining = remaining.substring(matchIndex + matchLength);
    }

    return parts;
  };

  return lines.map((line, lineIndex) => {
    // Empty lines
    if (line.trim() === '') {
      return <br key={lineIndex} />;
    }

    // Headers: ### Header
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const content = headerMatch[2];
      const fontSize = level === 1 ? '1.25em' : level === 2 ? '1.1em' : '1em';
      return (
        <div 
          key={lineIndex} 
          style={{ 
            fontWeight: 'bold', 
            fontSize, 
            marginTop: '0.75em', 
            marginBottom: '0.25em' 
          }}
        >
          {parseInline(content, `${lineIndex}`)}
        </div>
      );
    }

    // List items: * item or - item (with optional indentation)
    const listMatch = line.match(/^(\s*)[\*\-]\s+(.+)$/);
    if (listMatch) {
      const indent = listMatch[1].length;
      const content = listMatch[2];
      const marginLeft = Math.floor(indent / 4) * 1.25; // Nested lists
      return (
        <div 
          key={lineIndex} 
          style={{ 
            marginLeft: `${marginLeft}em`, 
            paddingLeft: '1em',
            textIndent: '-0.75em',
            marginTop: '0.15em',
            marginBottom: '0.15em'
          }}
        >
          • {parseInline(content, `${lineIndex}`)}
        </div>
      );
    }

    // Regular text with inline formatting
    return (
      <span key={lineIndex}>
        {parseInline(line, `${lineIndex}`)}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function Chatbot({ isOpen, onClose, onLogout }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastUserMessageRef = useRef<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const sendMessageToApi = useCallback(async (messagesToSend: ChatMessage[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await askChatBot(messagesToSend);
      
      if (response.success && response.result) {
        // Add response to messages
        const botMessage: ChatMessage = {
          text: response.result,
          isUser: false
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        setError('Risposta non valida dal server.');
      }
    } catch (err) {
      console.error('Errore chiamata askChatBot:', err);
      setError('Impossibile ottenere una risposta.');

      if (err instanceof ApiErrorWithResponse && err.statusCode === 401) {
        onLogout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [onLogout]);

  const handleSendMessage = useCallback(() => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    lastUserMessageRef.current = userMessage;
    const newMessages = [...messages, { text: userMessage, isUser: true }];
    setMessages(newMessages);
    setInput('');

    sendMessageToApi(newMessages);
  }, [input, isLoading, messages, sendMessageToApi]);

  const handleRetry = useCallback(() => {
    if (lastUserMessageRef.current && messages.length > 0) {
      sendMessageToApi(messages);
    }
  }, [messages, sendMessageToApi]);

  const handleSuggestedQuestion = useCallback((question: string) => {
    setInput(question);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  }, [handleSendMessage, isLoading]);

  const handleNewConversation = useCallback(() => {
    setShowNewConversationDialog(true);
  }, []);

  const confirmNewConversation = useCallback(() => {
    setMessages([]);
    setInput('');
    setError(null);
    setShowNewConversationDialog(false);
  }, []);

  const cancelNewConversation = useCallback(() => {
    setShowNewConversationDialog(false);
  }, []);

  const isDisabled = isLoading || !isOnline;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-end sm:justify-end z-50 p-0 sm:p-4 md:p-6">
      <div className="bg-white rounded-t-lg sm:rounded-lg shadow-2xl w-full sm:w-full sm:max-w-md h-[90vh] sm:h-[85vh] md:h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-[#0066cc] px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 md:py-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-white p-1.5 sm:p-2 rounded-full">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#0066cc]" />
            </div>
            <div>
              <h3 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-['Titillium_Web:Bold',sans-serif]">
                Assistente turistico AI
              </h3>
              <p className={`text-[11px] sm:text-[12px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif] ${isOnline ? 'text-[#bfdfff]' : 'text-[#ffd699]'}`}>
                {isOnline ? 'Online' : 'Offline. Connettiti a Internet per parlare con me'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNewConversation}
              disabled={messages.length === 0 || isLoading}
              title="Nuova conversazione"
              className={`text-white transition-colors ${
                messages.length === 0 || isLoading
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:text-[#bfdfff]'
              }`}
            >
              <MessageSquarePlus className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className={`text-white transition-colors ${
                isLoading
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:text-[#bfdfff]'
              }`}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-3 sm:mt-4 md:mt-8">
              <p className="text-[13px] sm:text-[14px] md:text-[16px] font-['Titillium_Web:Regular',sans-serif] mb-3 sm:mb-4">
                Ciao! Come posso aiutarti oggi?
              </p>
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question.text)}
                    disabled={isLoading}
                    className={`block w-full text-left px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 bg-[#f0f7ff] text-[#0066cc] rounded-lg transition-colors text-[12px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif] ${
                      isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#bfdfff]'
                    }`}
                  >
                    {question.emoji} {question.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[85%] md:max-w-[80%] px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 rounded-lg ${
                      msg.isUser
                        ? 'bg-[#0066cc] text-white'
                        : 'bg-gray-100 text-[#004080]'
                    }`}
                  >
                    <div className="text-[13px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]">
                      {msg.isUser ? msg.text : formatMessageText(msg.text)}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-lg">
                    <div className="flex items-center gap-1">
                      <span className="chatbot-loading-dot"></span>
                      <span className="chatbot-loading-dot"></span>
                      <span className="chatbot-loading-dot"></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && !isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] sm:max-w-[85%] md:max-w-[80%] px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 chatbot-error-bubble">
                    <p className="text-[13px] sm:text-[13px] md:text-[14px] chatbot-error-text">
                      {error}{' '}
                      <button
                        onClick={handleRetry}
                        className="chatbot-retry-button"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Riprova
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-2.5 sm:p-3 md:p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isOnline ? "Scrivi un messaggio..." : "Connessione assente..."}
              disabled={isDisabled}
              className={`flex-1 px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:border-[#0066cc] focus:outline-none text-[13px] sm:text-[14px] font-['Titillium_Web:Regular',sans-serif] ${isDisabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
            />
            <button
              onClick={handleSendMessage}
              disabled={isDisabled}
              className={`bg-[#0066cc] text-white px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 rounded-lg transition-colors ${!isDisabled ? 'hover:bg-[#004d99]' : 'opacity-60 cursor-not-allowed'}`}
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirm new conversation dialog */}
      {showNewConversationDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#fff3e0] p-2 rounded-full">
                <MessageSquarePlus className="w-5 h-5 text-[#f57c00]" />
              </div>
              <h4 className="text-[16px] sm:text-[18px] font-['Titillium_Web:Bold',sans-serif] text-[#004080]">
                Nuova conversazione
              </h4>
            </div>
            <p className="text-[13px] sm:text-[14px] font-['Titillium_Web:Regular',sans-serif] text-gray-600 mb-5">
              Sei sicuro di voler iniziare una nuova conversazione? La conversazione corrente andrà persa.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelNewConversation}
                className="px-4 py-2 text-[13px] sm:text-[14px] font-['Titillium_Web:Regular',sans-serif] text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={confirmNewConversation}
                className="px-4 py-2 text-[13px] sm:text-[14px] font-['Titillium_Web:Bold',sans-serif] bg-[#0066cc] text-white rounded-lg hover:bg-[#004d99] transition-colors"
              >
                Conferma
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}