import React, { useRef } from "react";
import Kakao from "./Kakao";
import axios from "axios";

const SigninModal = ({ open, close }) => {
  const email_ref = useRef(null);
  const password_ref = useRef(null);

  const SignInSubmitHandler = (e) => {
    e.preventDefault();

    axios
      .post("http://13.124.252.225/api/auth/login", {
        useremail: email_ref.current.value,
        password: password_ref.current.value,
      })
      .then((response) => {
        console.log(response);
        localStorage.setItem("user-email", email_ref.current.value);
        localStorage.setItem("access-token", response.headers.authorization);
        alert(response.data.message);
        window.location.reload();
      })
      .catch((error) => {
        alert(error.response.data.errorMessage);
        email_ref.current.value = "";
        password_ref.current.value = "";
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
            로그인
          </header>
          <main>
            <form onSubmit={SignInSubmitHandler}>
              Email
              <input
                type="email"
                ref={email_ref}
                placeholder="Email@example.com"
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
              <button className="close">log In</button>
            </form>
            <p style={{color:"gray", textAlign:"center"}}>social login</p>
            <Kakao />
          </main>
          <footer></footer>
        </section>
      ) : null}
    </div>
  );
};

export default SigninModal;
