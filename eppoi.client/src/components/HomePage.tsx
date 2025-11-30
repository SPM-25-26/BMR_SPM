import { useState } from 'react';
import { LogOut, Search, MessageCircle, X, Send, MapPin, Utensils, Landmark, ShoppingBag, Camera } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from 'figma:asset/958defa264c22f47e7a42e2e88ba5be34b61d176.png';

interface HomePageProps {
  user: {
    name: string;
    userName: string;
    email: string;
  };
  onLogout: () => void;
}

export default function HomePage({ user, onLogout }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Monumenti', 'Musei']);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [chatInput, setChatInput] = useState('');

  const interests = [
    { name: 'Monumenti', icon: Landmark },
    { name: 'Musei', icon: Camera },
    { name: 'Shopping', icon: ShoppingBag },
    { name: 'Food', icon: Utensils },
  ];

  const recommendations = [
    {
      title: 'Duomo di Firenze',
      category: 'Monumenti',
      location: 'Firenze Centro',
      distance: '1.2 km',
      image: 'https://images.unsplash.com/photo-1694765368961-2d142bed8154?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9yZW5jZSUyMGNhdGhlZHJhbCUyMGR1b21vfGVufDF8fHx8MTc2NDUyNTIzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      title: 'Galleria degli Uffizi',
      category: 'Musei',
      location: 'Piazzale degli Uffizi',
      distance: '800 m',
      image: 'https://images.unsplash.com/photo-1579748048451-365c9c9bfbc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1ZmZpemklMjBnYWxsZXJ5JTIwZmxvcmVuY2V8ZW58MXx8fHwxNzY0NTIxODQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      title: 'Ponte Vecchio',
      category: 'Monumenti',
      location: 'Lungarno',
      distance: '1.5 km',
      image: 'https://images.unsplash.com/photo-1694947713461-13a2f933c827?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb250ZSUyMHZlY2NoaW8lMjBicmlkZ2V8ZW58MXx8fHwxNzY0NTI1MjM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      title: 'Trattoria Mario',
      category: 'Food',
      location: 'Via Rosina',
      distance: '500 m',
      image: 'italian restaurant interior',
    },
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages(prev => [...prev, { text: chatInput, isUser: true }]);
      
      // Simulate AI response
      setTimeout(() => {
        const responses = [
          'Ecco alcuni luoghi interessanti nelle vicinanze: il Duomo di Firenze, la Galleria degli Uffizi e Palazzo Vecchio.',
          'Ti consiglio di provare la Trattoria Mario per cibo tradizionale toscano, oppure il Mercato Centrale.',
          'Nelle vicinanze puoi visitare il Giardino di Boboli, un bellissimo parco storico con vista sulla città.',
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setChatMessages(prev => [...prev, { text: randomResponse, isUser: false }]);
      }, 1000);
      
      setChatInput('');
    }
  };

  const filteredRecommendations = recommendations.filter(rec =>
    selectedInterests.length === 0 || selectedInterests.includes(rec.category)
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#0066cc] px-3 sm:px-4 py-4 sm:py-5 md:py-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src={logoImage} alt="Eppoi" className="h-5 sm:h-6 md:h-7 ml-1 sm:ml-2" />
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 sm:gap-2 bg-white text-[#0066cc] hover:bg-[#bfdfff] px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <span className="text-[13px] sm:text-[14px] md:text-[16px] font-['Titillium_Web:SemiBold',sans-serif]">Esci</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-3 sm:px-4 py-5 sm:py-6 md:py-8 overflow-x-hidden">
        <div className="w-full mx-auto" style={{ maxWidth: '1280px' }}>
          {/* Welcome Section */}
          <div className="mb-5 sm:mb-6 md:mb-8">
            <h2 className="text-[#004d99] text-[22px] sm:text-[24px] md:text-[32px] font-['Titillium_Web:Bold',sans-serif] mb-1 sm:mb-2">
              Ciao {user.name}!
            </h2>
            <p className="text-[#004080] text-[15px] sm:text-[16px] md:text-[18px] font-['Titillium_Web:Regular',sans-serif]">
              Dove vuoi andare oggi?
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-5 sm:mb-6 md:mb-8">
            <div className="relative">
              <Search className="absolute left-3 sm:left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca luoghi, eventi, attività..."
                className="w-full pl-9 sm:pl-10 md:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-4 bg-white border-2 border-gray-200 rounded-lg focus:border-[#0066cc] focus:outline-none text-[14px] sm:text-[14px] md:text-[16px] font-['Titillium_Web:Regular',sans-serif] shadow-sm"
              />
            </div>
          </div>

          {/* Interests Filter */}
          <div className="mb-5 sm:mb-6 md:mb-8">
            <h3 className="text-[#004080] text-[16px] sm:text-[18px] md:text-[20px] font-['Titillium_Web:SemiBold',sans-serif] mb-3 sm:mb-3 md:mb-4">
              I tuoi interessi
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-2 md:gap-3">
              {interests.map((interest) => {
                const Icon = interest.icon;
                const isSelected = selectedInterests.includes(interest.name);
                return (
                  <button
                    key={interest.name}
                    onClick={() => toggleInterest(interest.name)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2 md:py-3 rounded-full text-[13px] sm:text-[14px] md:text-[16px] font-['Titillium_Web:SemiBold',sans-serif] transition-colors ${
                      isSelected
                        ? 'bg-[#0066cc] text-white'
                        : 'bg-white text-[#004080] border-2 border-[#0066cc] hover:bg-[#f0f7ff]'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    {interest.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-[#004080] text-[18px] sm:text-[20px] md:text-[24px] font-['Titillium_Web:Bold',sans-serif] mb-3 sm:mb-3 md:mb-4">
              Raccomandazioni per te
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {filteredRecommendations.map((rec, index) => (
                <RecommendationCard key={index} recommendation={rec} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 bg-[#0066cc] hover:bg-[#004d99] text-white p-3 sm:p-3 md:p-4 rounded-full shadow-lg transition-colors z-40"
      >
        <MessageCircle className="w-6 h-6 sm:w-6 sm:h-6 md:w-8 md:h-8" />
      </button>

      {/* Chatbot Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-end sm:justify-end z-50 p-0 sm:p-4 md:p-6">
          <div className="bg-white rounded-t-lg sm:rounded-lg shadow-2xl w-full sm:w-full sm:max-w-md h-[90vh] sm:h-[85vh] md:h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="bg-[#0066cc] px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 md:py-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-white p-1.5 sm:p-2 rounded-full">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#0066cc]" />
                </div>
                <div>
                  <h3 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-['Titillium_Web:Bold',sans-serif]">
                    Assistente AI
                  </h3>
                  <p className="text-[#bfdfff] text-[11px] sm:text-[12px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]">
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-[#bfdfff] transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 mt-3 sm:mt-4 md:mt-8">
                  <p className="text-[13px] sm:text-[14px] md:text-[16px] font-['Titillium_Web:Regular',sans-serif] mb-3 sm:mb-4">
                    Ciao! Come posso aiutarti oggi?
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => setChatInput('Cosa posso visitare vicino a me?')}
                      className="block w-full text-left px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 bg-[#f0f7ff] text-[#0066cc] rounded-lg hover:bg-[#bfdfff] transition-colors text-[12px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]"
                    >
                      💡 Cosa posso visitare vicino a me?
                    </button>
                    <button
                      onClick={() => setChatInput('Dove posso mangiare cibo tradizionale?')}
                      className="block w-full text-left px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 bg-[#f0f7ff] text-[#0066cc] rounded-lg hover:bg-[#bfdfff] transition-colors text-[12px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]"
                    >
                      🍝 Dove posso mangiare cibo tradizionale?
                    </button>
                  </div>
                </div>
              ) : (
                chatMessages.map((msg, index) => (
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

            {/* Chat Input */}
            <div className="border-t p-2.5 sm:p-3 md:p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Scrivi un messaggio..."
                  className="flex-1 px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:border-[#0066cc] focus:outline-none text-[13px] sm:text-[14px] font-['Titillium_Web:Regular',sans-serif]"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-[#0066cc] hover:bg-[#004d99] text-white px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface RecommendationCardProps {
  recommendation: {
    title: string;
    category: string;
    location: string;
    distance: string;
    image: string;
  };
}

function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
      <div className="h-36 sm:h-40 md:h-48 bg-gray-200 overflow-hidden">
        <ImageWithFallback
          src={recommendation.image}
          alt={recommendation.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 sm:p-3 md:p-4">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="bg-[#bfdfff] text-[#004080] px-2 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] md:text-[12px] font-['Titillium_Web:SemiBold',sans-serif]">
            {recommendation.category}
          </span>
          <span className="text-[#0066cc] text-[12px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:SemiBold',sans-serif]">
            {recommendation.distance}
          </span>
        </div>
        <h4 className="text-[#004080] text-[15px] sm:text-[16px] md:text-[18px] font-['Titillium_Web:Bold',sans-serif] mb-1.5 sm:mb-2">
          {recommendation.title}
        </h4>
        <div className="flex items-center gap-1 text-gray-600">
          <MapPin className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" />
          <span className="text-[12px] sm:text-[13px] md:text-[14px] font-['Titillium_Web:Regular',sans-serif]">
            {recommendation.location}
          </span>
        </div>
      </div>
    </div>
  );
}