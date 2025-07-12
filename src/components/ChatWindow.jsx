import { useState, useRef, useEffect } from 'react';
import { API_CONFIG, CHAT_CONFIG } from '../config';
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Loader2, Send, Trash2, Search, ThumbsUp, ThumbsDown, Smile } from "./ui/icons";
import { Input } from "./ui/input";
import { chatAPI } from '../lib/api';
import WeatherDisplay from './WeatherDisplay';
import MessageParser from './MessageParser';
import { parseWeatherData } from '../lib/weatherParser';

export const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [threadId, setThreadId] = useState(API_CONFIG.THREAD_ID || '2');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [reactions, setReactions] = useState({});
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Filter messages when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMessages([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    const filtered = messages.filter(msg => 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMessages(filtered);
  }, [searchQuery, messages]);
  
  // Load chat history when component mounts
  useEffect(() => {
    loadChatHistory();
  }, [threadId]);
  
  // Load chat history from MongoDB
  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const chatHistory = await chatAPI.getChatHistory(threadId);
      
      if (chatHistory && chatHistory.messages && chatHistory.messages.length > 0) {
        // Format messages for display
        const formattedMessages = chatHistory.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          weatherData: msg.weatherData
        }));
        
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
      setError('Failed to load chat history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle message reactions
  const handleReaction = (messageId, reactionType) => {
    setReactions(prev => {
      const newReactions = { ...prev };
      if (!newReactions[messageId]) {
        newReactions[messageId] = {};
      }
      
      // Toggle reaction
      if (newReactions[messageId][reactionType]) {
        delete newReactions[messageId][reactionType];
      } else {
        newReactions[messageId][reactionType] = true;
      }
      
      // Save reactions to localStorage
      localStorage.setItem('chat-reactions', JSON.stringify(newReactions));
      return newReactions;
    });
  };
  


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Import the mastraWeatherAPI from our new api.js file
      const { mastraWeatherAPI } = await import('../lib/api');
      
      // Make API call to our backend using the mastraWeatherAPI service
      const response = await mastraWeatherAPI.sendMessage(userMessage.content, API_CONFIG.THREAD_ID);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let agentResponse = '';
      let weatherData = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        agentResponse += chunk;
        
        // Update the UI with partial response
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const lastMessageIndex = updatedMessages.findIndex(
            (msg) => msg.role === 'agent' && msg.isPartial
          );
          
          if (lastMessageIndex !== -1) {
            // Update existing partial message
            updatedMessages[lastMessageIndex] = {
              ...updatedMessages[lastMessageIndex],
              content: agentResponse,
            };
          } else {
            // Add new partial message
            updatedMessages.push({
              role: 'agent',
              content: agentResponse,
              timestamp: new Date().toISOString(),
              isPartial: true,
            });
          }
          
          return updatedMessages;
        });
      }

      // Extract weather data from the response
      weatherData = parseWeatherData(agentResponse);
      
      // Final update with complete message
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastMessageIndex = updatedMessages.findIndex(
          (msg) => msg.role === 'agent' && msg.isPartial
        );
        
        if (lastMessageIndex !== -1) {
          // Update the partial message to final
          updatedMessages[lastMessageIndex] = {
            role: 'agent',
            content: agentResponse,
            timestamp: new Date().toISOString(),
            isPartial: false,
            weatherData: weatherData
          };
        }
        
        return updatedMessages;
      });
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      
      // Add error message to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'error',
          content: 'Failed to get response. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      if (messages.length > 0) {
        // Delete chat from MongoDB
        await chatAPI.deleteChat(threadId);
      }
      
      setMessages([]);
      setError(null);
    } catch (err) {
      console.error('Error clearing chat:', err);
      setError('Failed to clear chat history');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Load saved reactions from localStorage
  useEffect(() => {
    const savedReactions = localStorage.getItem('chat-reactions');
    if (savedReactions) {
      try {
        setReactions(JSON.parse(savedReactions));
      } catch (e) {
        console.error('Error loading saved reactions:', e);
      }
    }
  }, []);

  return (
    <Card className="flex flex-col h-full border-none shadow-none bg-white px-4 sm:px-6 md:px-8 lg:px-16 text-black">

  {/* Header */}
  <CardHeader className="bg-white py-3 px-0">
    <div className="w-full mx-auto max-w-screen-lg flex justify-between items-center">
      <CardTitle className="text-xl text-black font-bold">Weather Agent Chat</CardTitle>
      <div className="flex gap-2">
        {isLoadingHistory && (
          <div className="flex items-center text-black">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-xs">Loading history...</span>
          </div>
        )}
        <Button 
          variant="secondary" 
          size="sm" 
          className="text-black"
          onClick={clearChat}
          disabled={isLoading || messages.length === 0}
        >
          <Trash2 className="h-4 w-4 text-black mr-1" />
          Clear Chat
        </Button>
      </div>
    </div>
  </CardHeader>

  {/* Chat Content + Search */}
  <CardContent className="flex-1 px-0 py-4 overflow-y-auto bg-white scrollbar-hide">
    <div className="w-full mx-auto max-w-screen-lg px-4 sm:px-6 md:px-8 lg:px-16">

      {/* Search bar */}
      <div className="mb-4 flex items-center space-x-2">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-black bg-gray-100 border-none"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-black" />
        </div>
        {searchQuery && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSearchQuery('')}
            className="text-black"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Messages */}
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-black">
          <p>Send a message to start chatting with the Weather Agent</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(isSearching ? filteredMessages : messages).map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in text-black`}
            >
              <div 
                className={`max-w-[75%] rounded-lg p-3 ${
                  message.role === 'user' 
                    ? 'bg-gray-100 text-black rounded-tr-none' 
                    : message.role === 'error' 
                      ? 'bg-destructive/10 text-destructive border border-destructive/20' 
                      : 'bg-gray-100 text-black shadow-sm rounded-tl-none'
                }`}
              >
                {message.role === 'agent' ? (
                  <MessageParser content={message.content} weatherData={message.weatherData} />
                ) : (
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                )}

                <div className={`text-xs mt-1 ${message.role === 'error' ? 'text-destructive' : 'text-black'}`}>
                  {formatTimestamp(message.timestamp)}
                  {message.isPartial && <span className="ml-2 animate-pulse">•••</span>}
                </div>

                {/* Reactions */}
                {message.role === 'agent' && (
                  <div className="flex mt-2 space-x-1 justify-end">
                    <Button
                      variant={reactions[index]?.thumbsUp ? 'default' : 'ghost'}
                      size="icon"
                      className={`h-6 w-6 ${reactions[index]?.thumbsUp ? 'bg-blue-500' : 'text-black'}`}
                      onClick={() => handleReaction(index, 'thumbsUp')}
                    >
                      <ThumbsUp className={`h-3 w-3 ${reactions[index]?.thumbsUp ? 'text-white' : 'text-black'}`} />
                    </Button>
                    <Button
                      variant={reactions[index]?.thumbsDown ? 'default' : 'ghost'}
                      size="icon"
                      className={`h-6 w-6 ${reactions[index]?.thumbsDown ? 'bg-blue-500' : 'text-black'}`}
                      onClick={() => handleReaction(index, 'thumbsDown')}
                    >
                      <ThumbsDown className={`h-3 w-3 ${reactions[index]?.thumbsDown ? 'text-white' : 'text-black'}`} />
                    </Button>
                    <Button
                      variant={reactions[index]?.smile ? 'default' : 'ghost'}
                      size="icon"
                      className={`h-6 w-6 ${reactions[index]?.smile ? 'bg-blue-500' : 'text-black'}`}
                      onClick={() => handleReaction(index, 'smile')}
                    >
                      <Smile className={`h-3 w-3 ${reactions[index]?.smile ? 'text-white' : 'text-black'}`} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  </CardContent>

  {/* Input Footer */}
  <CardFooter className="w-full px-4 sm:px-6 md:px-8 lg:px-16 py-4 bg-white ">
    <div className="w-full mx-auto max-w-screen-lg">
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }} 
        className="flex w-full items-end gap-2 bg-white px-4 py-2 rounded-xl shadow-lg"
      >
        <Textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="min-h-[60px] flex-1 text-black bg-white resize-none border-none rounded-lg focus:outline-none focus:ring-0"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading || inputValue.trim() === ''}
          className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-white animate-spin" />
          ) : (
            <Send className="h-5 w-5 text-white" />
          )}
        </Button>
      </form>
    </div>
  </CardFooter>

</Card>

  );
};

export default ChatWindow;