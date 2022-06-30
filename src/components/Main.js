import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import ChatModal from "./ChatModal";
import SigninModal from "./SigninModal";
import SignupModal from "./SignupModal";
import ReactDOM from "react-dom";

const socket = io.connect("http://localhost:3001");

const localStoragetokenCheck = localStorage.getItem("access-token");

const Main = () => {
  const [chatModalOpen, setChatModalOpen] = React.useState(false);
  const [signinModalOpen, setSigninModalOpen] = React.useState(false);
  const [signupModalOpen, setSignupModalOpen] = React.useState(false);
  const [nick, setNick] = useState("");
  const [room, setRoom] = useState("");

  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("access-token");
    window.location.reload();
  };

  const roomChange = (event) => {
    setRoom(event.target.value);
  };

  const nickChange = (event) => {
    setNick(event.target.value);
  };

  //open modal
  const openChatModal = (e) => {
    e.preventDefault();
    if (room !== "") {
      socket.emit("join_room", room, nick);
      localStorage.setItem("username", nick);
      setChatModalOpen(true);
    }
  };
  const openSigninModal = () => {
    setSigninModalOpen(true);
  };
  const openSignupModal = () => {
    setSignupModalOpen(true);
  };

  //close modal
  const closeChatModal = () => {
    localStorage.removeItem("username");
    setRoom("");
    setNick("");
    setChatModalOpen(false);
  };
  const closeSigninModal = () => {
    setSigninModalOpen(false);
  };
  const closeSignupModal = () => {
    setSignupModalOpen(false);
  };

  return (
    <React.Fragment>
      <h1>🐧 실시간 채팅 테스트</h1>
      {!localStoragetokenCheck ? (
        <div className="auth">
          <button onClick={openSigninModal}>로그인</button>
          <button onClick={openSignupModal}>회원가입</button>
        </div>
      ) : (
        <div className="auth">
          <button onClick={logOut}>로그아웃</button>
        </div>
      )}

      <form onSubmit={openChatModal} className="App">
        <input
          value={room}
          onChange={roomChange}
          type="text"
          placeholder="Room name"
          required
        />
        <input
          value={nick}
          onChange={nickChange}
          type="text"
          placeholder="Nickname"
        />
        <div className="room_btn">
          <button className="chat_button">채팅방 입장</button>
          <button
            onClick={() => {
              navigate("/video");
            }}
          >
            화상 채팅방 입장
          </button>
        </div>
      </form>

      {/* portal chat modal */}
      {chatModalOpen &&
        ReactDOM.createPortal(
          <ChatModal
            socket={socket}
            open={openChatModal}
            close={closeChatModal}
            room={room}
            nick={nick}
          />,
          document.getElementById("modal")
        )}
      {/* portal signin modal */}
      {signinModalOpen &&
        ReactDOM.createPortal(
          <SigninModal open={openSigninModal} close={closeSigninModal} />,
          document.getElementById("modal")
        )}

      {/* portal signup modal */}
      {signupModalOpen &&
        ReactDOM.createPortal(
          <SignupModal
            open={openSignupModal}
            openSigninModal={openSigninModal}
            close={closeSignupModal}
          />,
          document.getElementById("modal")
        )}
    </React.Fragment>
  );
};

export default Main;
