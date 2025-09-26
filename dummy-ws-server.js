// dummy-ws-server.js
import { WebSocketServer } from "ws";
import { createServer } from "http";
import fs from "fs";

// HTTP 서버를 만들고 그 위에 WebSocketServer 올리기
const server = createServer();
const wss = new WebSocketServer({ server });

function rand(min, max) {
  return (Math.random() * (max - min) + min).toFixed(3);
}

// 이미지 파일을 base64로 읽기
const imgBase641 = fs.readFileSync("/home/choiyj/hmgui/dummy1.jpg").toString("base64");
const dataUrl1 = "data:image/jpeg;base64," + imgBase641;

const imgBase642 = fs.readFileSync("/home/choiyj/hmgui/dummy2.jpg").toString("base64");
const dataUrl2 = "data:image/jpeg;base64," + imgBase642;

// 클라이언트 연결 처리
wss.on("connection", (ws, req) => {
  if (req.url === "/ws/data") {
    console.log("Client connected to /ws/data");

    // 주기적으로 더미 로봇 데이터 전송
    const interval = setInterval(() => {
      const robotMsg = {
        left_joint_angles: Array.from({ length: 7 }, () => parseFloat(rand(-90, 90))),
        right_joint_angles: Array.from({ length: 7 }, () => parseFloat(rand(-90, 90))),
        left_hand_angles: Array.from({ length: 6 }, () => parseFloat(rand(-45, 45))),
        right_hand_angles: Array.from({ length: 6 }, () => parseFloat(rand(-45, 45))),
        left_cartesian_position: [rand(-0.5, 0.5), rand(-0.5, 0.5), rand(0.2, 1.0), 1, 0, 0, 0],
        right_cartesian_position: [rand(-0.5, 0.5), rand(-0.5, 0.5), rand(0.2, 1.0), 0, 1, 0, 0],

        dataset_name: "demo_dataset",
        session_id: "session_X",
        operator: "tester",
        date_time: new Date().toLocaleString(),
        task: "Pick-and-Place",
        robot_model: "RB-Y1",
        hand_model: "RH56F1",
        environment: "IsaacSim - simple room",
        control_mode: "Position Control",
        rgb_res: "640x480",
        rgb_fps: 30,
      };

      ws.send(JSON.stringify(robotMsg));
    }, 1000);

    ws.on("close", () => clearInterval(interval));
  }

  if (req.url === "/ws/image") {
    console.log("Client connected to /ws/image");

    // 주기적으로 더미 이미지 전송
    const interval = setInterval(() => {
      const imageMsg = {
        ego_rgb: dataUrl1, // App.jsx에서 ego_rgb로 매핑됨
        exo_rgb: dataUrl2,
      };
      ws.send(JSON.stringify(imageMsg));
    }, 2000);

    ws.on("close", () => clearInterval(interval));
  }
});

// 서버 시작
server.listen(9090, () => {
  console.log("Dummy WS Server running at ws://localhost:9090");
});
