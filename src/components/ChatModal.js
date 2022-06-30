import React, { useEffect, useState } from "react";

import "./Modal.css";

const Modal = ({ socket, nick, room, open, close }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const getUserName = localStorage.getItem("username");

  const inputChange = (event) => {
    setCurrentMessage(event.target.value);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: nick,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      socket.emit("send_message", messageData);
      setMessageList((list) => [messageData, ...list]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [data, ...list]);
    });
    socket.on("welcome", (data) => {
      console.log(data);
      setMessageList((list) => [data, ...list]);
    });
    socket.on("bye", (data) => {
      console.log(data);
      setMessageList((list) => [{ message: "님이 퇴장하셨습니다." }, ...list]);
    });
  }, [socket]);

  //모달 바깥영역 클릭시 close
  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  return (
    <div onClick={handleClose} className={open ? "openModal modal" : "modal"}>
      {open ? (
        <section>
          <header>
            <button className="close" onClick={close}>
              &times;
            </button>
            Room: {room}
          </header>
          <main>
            <div className="chat-list">
              {messageList.map((messageContent, index) => {
                return (
                  <div key={index} className="message">
                    {nick === messageContent.author && nick ? (
                      <p style={{ fontWeight: "bold" }}>
                        you :{messageContent.message}
                      </p>
                    ) : !messageContent.message ? (
                      <p>
                        {messageContent.author || "익명 사용자"}님이
                        입장하셨습니다.👀
                      </p>
                    ) : messageContent.message === "님이 퇴장하셨습니다." ? (
                      <p>
                        {getUserName || "익명 사용자"}
                        {messageContent.message}😢
                      </p>
                    ) : (
                      <p style={{ color: "brown" }}>
                        {messageContent.author || "익명 사용자"}:
                        {messageContent.message}
                      </p>
                    )}
                    <p id="time">{messageContent.time}</p>
                  </div>
                );
              })}
            </div>
            <form onSubmit={sendMessage}>
              <input
                onChange={inputChange}
                value={currentMessage}
                type="text"
                placeholder="message"
              />
              <button>입력</button>
            </form>
          </main>
        </section>
      ) : null}
    </div>
  );
};

export default Modal;
