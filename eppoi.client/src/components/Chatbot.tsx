import { useState, useCallback, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

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

    // Aggiungi messaggio utente
    setMessages(prev => [...prev, { text: input, isUser: true }]);

    // Simula risposta del bot
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
          <button
            onClick={onClose}
            className="text-white hover:text-[#bfdfff] transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
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
    </div>
  );
}