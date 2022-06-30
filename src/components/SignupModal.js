import React, { useRef } from "react";
import axios from "axios";


const SignupModal = ({ open, openSigninModal, close }) => {
  const email_ref = useRef(null);
  const nickname_ref = useRef(null);
  const password_ref = useRef(null);
  const passwordCheck_ref = useRef(null);

  const SignUpSubmitHandler = (e) => {
    e.preventDefault();
    axios
      .post("http://13.124.252.225/api/auth/signup", {
        email: email_ref.current.value,
        nickname: nickname_ref.current.value,
        password: password_ref.current.value,
        passwordCheck: passwordCheck_ref.current.value,
      })
      .then((response) => {
        alert(response.data.msg); // 회원가입 완료
        close();
        openSigninModal();
      })
      .catch((error) => {
        // 해당 오류 메세지 생성
        console.log(error.response);
        alert(error.response.data.msg);
        email_ref.current.value = "";
        nickname_ref.current.value = "";
        password_ref.current.value = "";
        passwordCheck_ref.current.value = "";
      });
  };

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
            회원가입
          </header>
          <main>
            <form onSubmit={SignUpSubmitHandler}>
              Email
              <input
                type="email"
                ref={email_ref}
                placeholder="Email@example.com"
                required
              />
              Nickname
              <input
                type="text"
                ref={nickname_ref}
                placeholder="Nickname"
                required
              />
              Password
              <input
                type="password"
                ref={password_ref}
                placeholder="Password"
                autoComplete="on"
                required
              />
              Password
              <input
                type="password"
                ref={passwordCheck_ref}
                placeholder="Password Check"
                autoComplete="on"
                required
              />
              <button className="close">log In</button>
            </form>
          </main>
          <footer></footer>
        </section>
      ) : null}
    </div>
  );
};
export default SignupModal;
