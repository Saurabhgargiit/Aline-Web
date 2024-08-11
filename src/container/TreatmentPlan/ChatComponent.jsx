import React, { useState } from 'react';
import './ChatComponent.scss';
import Button from '../../components/Button/Button';
import TextArea from '../../components/TextArea/TextArea';

function ChatComponent() {
  const [comment, setComment] = useState('');
  const [messages, setMessages] = useState([]);
  const currentUser = 'John Doe';
  const currentRole = 'Doctor';
  const currentDate = new Date().toLocaleString();

  const handleSendMessage = () => {
    if (comment) {
      setMessages([
        ...messages,
        {
          name: currentUser,
          role: currentRole,
          date: currentDate,
          comment,
        },
      ]);
      setComment('');
    }
  };

  return (
    <div className="patientAddEditTopContainer">
      <div className="patientAddEditContainer chat-container">
        <h3>Treatment Plan discussion</h3>
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.name === currentUser ? 'message-right' : 'message-left'
              }`}
            >
              <div className="message-header">
                <strong>{msg.name}</strong>{' '}
                <span className="role">({msg.role})</span>{' '}
                <span className="date">{msg.date}</span>
              </div>
              <div className="message-body">{msg.comment}</div>
            </div>
          ))}
        </div>
        <div className="input-container">
          <TextArea
            posClassName={'patient-detials-input-fields gap-8 sub-heading'}
            placeholder="Your comment"
            value={comment}
            onChangeCallBack={e => setComment(e.target.value)}
            // textAreaClass="input-field"
          />
          <Button
            title="Send"
            onClickCallBk={handleSendMessage}
            type="primary"
            className="send-button"
          />
        </div>
      </div>
    </div>
  );
}

export default ChatComponent;
