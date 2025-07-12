'use client'

import React, { useState } from "react"
import { FiMessageSquare, FiX, FiSend } from "react-icons/fi"
import { FaRobot, FaComments, FaLightbulb, FaCog } from "react-icons/fa"

type ChatMessage = {
  type: "user" | "bot"
  text: string
}

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      type: "bot",
      text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?"
    }
  ])

  const features = [
    { icon: <FaRobot className="text-3xl mb-4" />, title: "AI Powered", desc: "Đối thoại thông minh với AI" },
    { icon: <FaComments className="text-3xl mb-4" />, title: "24/7 Support", desc: "Luôn sẵn sàng hỗ trợ" },
    { icon: <FaLightbulb className="text-3xl mb-4" />, title: "Smart Learning", desc: "Cải thiện liên tục" },
    { icon: <FaCog className="text-3xl mb-4" />, title: "Customizable", desc: "Tùy chỉnh linh hoạt" },
  ]

  const handleSend = async () => {
    if (!message.trim()) return

    const userInput = { type: "user", text: message }
    const updatedChat = [...chatHistory, userInput]
    setChatHistory(updatedChat)
    setMessage("")

    try {
      const mergedUserText = updatedChat
        .filter(msg => msg.type === 'user')
        .map(msg => msg.text)
        .join(' ');

      const response = await fetch("https://TangSan003-api-chatbot-travel-multi-turn-chat-gemini.hf.space/pred", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: message,
          extract: mergedUserText,
        })
      })
      
      console.log("mergedUserText: ", mergedUserText);
      
      const data = await response.json()
      const reply = data.answer || "🤖 Không có phản hồi từ server."

      setChatHistory(prev => [...prev, { type: "bot", text: reply }])
    } catch (error) {
      
      setChatHistory(prev => [...prev, { type: "bot", text: "❌ Lỗi khi gọi API." }])
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="py-6 bg-gradient-to-b from-gray-100 to-gray-200 text-center">
        <h1 className="text-3xl font-bold text-gray-800">ChatBot Thông Minh</h1>
        <p className="text-gray-600">Trợ lý AI giúp bạn 24/7</p>
      </header>

      <section className="py-16 px-4 text-center bg-gradient-to-b from-gray-200 to-gray-100">
        <h2 className="text-4xl font-bold mb-6">Giới Thiệu</h2>
        <p className="mb-10 text-gray-600 text-lg">Công nghệ AI hiện đại giúp giao tiếp tự nhiên và hiệu quả</p>
        <div className="flex justify-center gap-6 flex-wrap">
          <img src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a" alt="ai" className="w-60 h-40 object-cover rounded shadow-lg" />
          <img src="https://images.unsplash.com/photo-1535378917042-10a22c95931a" alt="tech" className="w-60 h-40 object-cover rounded shadow-lg" />
        </div>
      </section>

      <section className="py-16 bg-white px-4">
        <h2 className="text-3xl font-semibold text-center mb-10">Tính Năng Nổi Bật</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-lg shadow hover:scale-105 transform transition">
              <div className="text-gray-700 flex justify-center">{f.icon}</div>
              <h3 className="mt-2 text-xl font-semibold text-gray-800">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Nút Chat nổi */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-500 transition"
      >
        <FiMessageSquare className="text-2xl" />
      </button>

      {/* Hộp Chat */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-[500px] bg-white border border-gray-300 rounded-lg shadow-xl flex flex-col z-50">
          <div className="p-3 bg-blue-600 text-white flex justify-between items-center rounded-t-lg">
            <span>Chat Assistant</span>
            <button onClick={() => setIsChatOpen(false)}>
              <FiX className="text-xl" />
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`mb-2 ${msg.type === "user" ? "text-right" : "text-left"}`}>
                <div className={`inline-block px-3 py-2 rounded-lg ${msg.type === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={message}
              style={{ color: "black" }}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Nhập tin nhắn..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none"
            />
            <button onClick={handleSend} className="bg-blue-600 text-white px-3 rounded hover:bg-blue-500">
              <FiSend />
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
