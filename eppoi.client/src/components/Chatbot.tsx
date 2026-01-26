import { useState, useCallback, useEffect } from 'react';
import { MessageCircle, X, Send, MessageSquarePlus } from 'lucide-react';

export interface ChatMessage {
  text: string;
  isUser: boolean;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const suggestedQuestions = [
  { emoji: '💡', text: 'Cosa posso visitare a Cupra Marittima?' },
  { emoji: '🍝', text: 'Dove posso mangiare cibo tradizionale?' },
  { emoji: '🗺️', text: 'Ci sono degli itinerari consigliati in zona?' },
];

const botResponses = [
  'Ecco alcuni luoghi interessanti nelle vicinanze: il Duomo di Firenze, la Galleria degli Uffizi e Palazzo Vecchio.',
  'Ti consiglio di provare la Trattoria Mario per cibo tradizionale toscano, oppure il Mercato Centrale.',
  'Nelle vicinanze puoi visitare il Giardino di Boboli, un bellissimo parco storico con vista sulla città.',
];

export default function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false);

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

  const handleSendMessage = useCallback(() => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isUser: true }]);

    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      setMessages(prev => [...prev, { text: randomResponse, isUser: false }]);
    }, 1000);

    setInput('');
  }, [input]);

  const handleSuggestedQuestion = useCallback((question: string) => {
    setInput(question);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleNewConversation = useCallback(() => {
    setShowNewConversationDialog(true);
  }, []);

  const confirmNewConversation = useCallback(() => {
    setMessages([]);
    setInput('');
    setShowNewConversationDialog(false);
  }, []);

  const cancelNewConversation = useCallback(() => {
    setShowNewConversationDialog(false);
  }, []);

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
              disabled={messages.length === 0}
              title="Nuova conversazione"
              className={`text-white transition-colors ${
                messages.length === 0
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:text-[#bfdfff]'
              }`}
            >
              <MessageSquarePlus className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-[#bfdfff] transition-colors"
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
                    className="block w-full text-left px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 bg-[#f0f7ff] text-[#0066cc] rounded-lg hover:bg-[#bfdfff] transition-colors text-[12px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]"
                  >
                    {question.emoji} {question.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
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
                  <p className="text-[13px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))
          )}
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
              disabled={!isOnline}
              className={`flex-1 px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:border-[#0066cc] focus:outline-none text-[13px] sm:text-[14px] font-['Titillium_Web:Regular',sans-serif] ${!isOnline ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
            />
            <button
              onClick={handleSendMessage}
              disabled={!isOnline}
              className={`bg-[#0066cc] text-white px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 rounded-lg transition-colors ${isOnline ? 'hover:bg-[#004d99]' : 'opacity-60 cursor-not-allowed'}`}
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