"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { User, Menu, X } from "lucide-react"
import ChatWindow from "../ChatWindow"

export default function ChatInterface() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    const email = localStorage.getItem("user-email")

    if (!token) {
      navigate("/")
    } else {
      setIsAuthenticated(true)
      setUserEmail(email || "")
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user-email")
    navigate("/")
  }

  if (!isAuthenticated) return null

  return (
    <div className="h-screen flex flex-col bg-white text-black">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Title */}
          <h1 className="text-xl font-semibold text-black">
            WeatherChat AI
          </h1>

          {/* Desktop controls */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-black">
              <User className="h-4 w-4" />
              <span>{userEmail}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-transparent text-black"
            >
              Logout
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <div className="sm:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <X className="h-6 w-6 text-black" />
              ) : (
                <Menu className="h-6 w-6 text-black" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="sm:hidden mt-3 flex flex-col space-y-3">
            <div className="flex items-center space-x-2 text-sm text-black">
              <User className="h-4 w-4" />
              <span>{userEmail}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-transparent w-full text-black"
            >
              Logout
            </Button>
          </div>
        )}
      </header>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow />
      </div>
    </div>
  )
}
