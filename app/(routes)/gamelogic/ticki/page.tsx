import React from 'react';
import '../css/Ticki.css'; // CSS 파일 import

const ChatPage: React.FC = () => {
  const messages = [
    {
      sender: "Ticki",
      time: "15:33",
      content: `안녕하세요 꼼짝한 강아지님! 궁금한 것이 있으면 무엇이든 물어보세요 😊
티키(Ticki)가 친절하게 답변드릴게요!`,
    },
    {
      sender: "Ticki",
      time: "15:33",
      content: `*주의사항
티키(Ticki)는 게임 결과에 직접적인 영향을 미치는 질문에 답변할 수 없습니다.`,
    },
    {
      sender: "User",
      time: "15:34",
      content: `금리가 뭐야?`,
    },
    {
      sender: "Ticki",
      time: "15:35",
      content: `금리는 돈을 빌리거나 예금할 때 발생하는 이자로, 대출금 또는 예금액에 비례하여 계산됩니다.`,
    },
  ];

  return (
    <div className="chat-container">
      {/* 대화 내용 */}
      <main className="chat-main">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender === "User" ? "user-message" : "ticki-message"}`}>
            <div className="chat-message-container">
              {/* Ticki 프로필 이미지 */}
              {msg.sender === "Ticki" && (
                <div className="chat-avatar">
                  <span>🤖</span>
                </div>
              )}
              {/* 메시지 내용 */}
              <div className="chat-bubble-container">
                <div className="chat-bubble">{msg.content}</div>
                <span className="chat-time">{msg.time}</span>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* 입력 필드 */}
      <footer className="chat-footer">
        <div className="footer-container">
          <input
            type="text"
            placeholder="메시지를 입력해주세요."
            className="chat-input"
          />
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
