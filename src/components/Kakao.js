import React from "react";
import kakaoImg from '../shared/kakako-icon.png'

const Kakao = () => {
  const REST_API_KEY = "84e59759e4947a92e73fdab6ee9815f9";
  const REDIRECT_URI = "http://localhost:3000";
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  return (
  
      <a className="kakao" href={KAKAO_AUTH_URL}><img alt="" src={kakaoImg}/></a>

  );
};

export default Kakao;
