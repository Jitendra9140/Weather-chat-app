import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInterface from '../components/chat/chat_interface';

export default function ChatPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  return <ChatInterface />;
}