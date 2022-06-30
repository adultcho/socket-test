import React, { useEffect, useRef, useState } from "react";

const Video = () => {
  const video_ref = useRef();
  //camera, mute control
  const [videoCtrl, setVideoCtrl] = useState(false);
  const [mute, setMute] = useState(false);

  //camera, audio device select
  const [cameraDevice, setCameraDevice] = useState([]);
  const [audioDevice, setAudioDevice] = useState([]);

  //선택한 device 적용
  const [audioId, setAudioId] = useState();
  const [cameraId, setCameraId] = useState();

  const user_video = video_ref.current; //video tag ref값 추출

  //camera on/off btn click
  const cameraClick = () => {
    user_video.srcObject
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    if (!videoCtrl) {
      setVideoCtrl(true);
    } else {
      setVideoCtrl(false);
    }
  };

  //mute on/off btn click
  const muteClick = () => {
    user_video.srcObject
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    if (!mute) {
      setMute(true);
    } else {
      setMute(false);
    }
  };

  //Media 실행(user video, audio)
  useEffect(() => {
    let myStream;
    //user device(camera) 정보 불러오기
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(
          (device) => device.kind === "videoinput"
        );
        const audios = devices.filter((device) => device.kind === "audioinput");
        // console.log(devices);

        //enumerateDevices로 kind = videoinput 정보 불러와서  sellect -> option에 state 값으로 value, label 삽입.
        setCameraDevice(cameras);
        setAudioDevice(audios);
      } catch (e) {
        console.log(e);
      }
    };

    const getMedia = async () => {
      // console.log(`오디오 선택: ${audioId}`);
      const initialConstrains = {
        audio: true,
        video: { facingMode: "user" }, //selfie mode
      };

      const deviceConstraints = {
        audio: { deviceId: { exact: audioId } },
        video: { deviceId: { exact: cameraId } },
      };

      try {
        myStream = await navigator.mediaDevices.getUserMedia(
          audioId || cameraId ? deviceConstraints : initialConstrains
        );

        video_ref.current.srcObject = myStream;
        console.log(myStream.getAudioTracks());

        await getCameras();
      } catch (e) {
        console.log(e);
      }
    };
    setMute(false);
    setVideoCtrl(false);

    getMedia();
  }, [audioId, cameraId]);

  const cameraSelect = (e) => {
    setCameraId(e.target.value);
  };

  const audioSelect = (e) => {
    setAudioId(e.target.value);
  };
  return (
    <React.Fragment>
      <h1>🐹 화상 채팅방이오</h1>
      <div className="video_control_btn">
        <button onClick={cameraClick}>
          {!videoCtrl ? "camera off" : "camera on"}
        </button>
        <button onClick={muteClick}>{!mute ? "mute" : "unmute"}</button>
      </div>
      <div className="video">
        <video
          ref={video_ref}
          id="myFace"
          autoPlay
          playsInline
          width="400px"
          height="400px"
        ></video>
      </div>
      <div className="devices">
        {/* camera select */}
        <select id="cameras" onChange={cameraSelect}>
          {cameraDevice.map((camera, index) => {
            return (
              <option key={index} value={camera.deviceId}>
                {camera.label}
              </option>
            );
          })}
        </select>
        {/* audio select */}
        <select onChange={audioSelect} id="audios">
          {audioDevice.map((audio) => {
            return (
              <option key={audio.deviceId} value={audio.deviceId}>
                {audio.label}
              </option>
            );
          })}
        </select>
      </div>
    </React.Fragment>
  );
};

export default Video;
