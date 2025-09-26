import React, { useState, useEffect } from "react";
import RobotInfo from "./components/RobotInfo";
import SensorInfo from "./components/SensorInfo";
import DatasetConfig from "./components/DatasetConfig";

function App() {
  /* ---------- Robot states ---------- */
  const [leftjointAngles, setLeftJointAngles] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [rightjointAngles, setRightJointAngles] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [leftcartesianCoords, setLeftCartesianCoords] = useState([0, 0, 0, 1, 0, 0, 0]);
  const [rightcartesianCoords, setRightCartesianCoords] = useState([0, 0, 0, 1, 0, 0, 0]);
  const [lefthandAngles, setLeftHandAngles] = useState([0, 0, 0, 0, 0, 0]);
  const [righthandAngles, setRightHandAngles] = useState([0, 0, 0, 0, 0, 0]);

  /* ---------- Camera & images ---------- */
  const [cameraImages, setCameraImages] = useState({
    ego_rgb: null,
    exo_rgb: null,
  });

  /* ---------- Dataset Config ---------- */
  const [dsConfig, setDsConfig] = useState({
    datasetName: "dataset_001",
    sessionId: "session_A",
    operator: "user01",
    dateTime: new Date().toLocaleString(),
    task: "Pick and Place",
    robotModel: "UR5e",
    handModel: "Allegro Hand",
    environment: "Simulation",
    controlMode: "Position Control",
    rgb: { res: "640x480", fps: 30 },
  });

  const mergeDatasetConfig = (data) => {
    const name = data.dataset_name ?? data.datasetName;
    const sid = data.session_id ?? data.sessionId;
    const oper = data.operator;
    const dt = data.date_time ?? data.dateTime;
    const task = data.task ?? data.task_prompt ?? dsConfig.task;
    const robotModel = data.robot_model ?? data.robotModel;
    const handModel = data.hand_model ?? data.handModel;
    const env = data.environment ?? data.environment_name ?? dsConfig.environment;
    const ctrl = data.control_mode ?? data.controlMode;

    const rgbObj = data.rgb ?? {};
    const rgbRes = rgbObj.res ?? data.rgb_res;
    const rgbFps = rgbObj.fps ?? data.rgb_fps;

    setDsConfig((prev) => ({
      ...prev,
      ...(name ? { datasetName: name } : {}),
      ...(sid ? { sessionId: sid } : {}),
      ...(oper ? { operator: oper } : {}),
      ...(dt ? { dateTime: dt } : {}),
      ...(task ? { task } : {}),
      ...(robotModel ? { robotModel } : {}),
      ...(handModel ? { handModel } : {}),
      ...(env ? { environment: env } : {}),
      ...(ctrl ? { controlMode: ctrl } : {}),
      ...(rgbRes || rgbFps
        ? { rgb: { res: rgbRes ?? prev.rgb.res, fps: rgbFps ?? prev.rgb.fps } }
        : {}),
    }));
  };

  useEffect(() => {
    const baseWsUrl = "ws://localhost:9090";
    let wsData, wsImage;

    // /ws/image : 카메라 이미지
    try {
      wsImage = new WebSocket(`${baseWsUrl}/ws/image`);
      wsImage.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // 서버에서 camera1_rgb, camera2_rgb로 보낸 경우 매핑
          const ego = data.camera1_rgb ?? data.ego_rgb;
          const exo = data.camera2_rgb ?? data.exo_rgb;

          setCameraImages((prev) => ({
            ...prev,
            ...(ego ? { ego_rgb: ego } : {}),
            ...(exo ? { exo_rgb: exo } : {}),
          }));
        } catch (err) {
          console.error("Image WebSocket parse error:", err);
        }
      };
    } catch (e) {
      console.warn("ws/image 연결 실패:", e);
    }

    // /ws/data : 로봇 상태 + 데이터셋 설정
    try {
      wsData = new WebSocket(`${baseWsUrl}/ws/data`);
      wsData.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.left_joint_angles !== undefined) setLeftJointAngles(data.left_joint_angles);
          if (data.right_joint_angles !== undefined) setRightJointAngles(data.right_joint_angles);
          if (data.left_hand_angles !== undefined) setLeftHandAngles(data.left_hand_angles);
          if (data.right_hand_angles !== undefined) setRightHandAngles(data.right_hand_angles);
          if (data.left_cartesian_position !== undefined) setLeftCartesianCoords(data.left_cartesian_position);
          if (data.right_cartesian_position !== undefined) setRightCartesianCoords(data.right_cartesian_position);

          mergeDatasetConfig(data);
        } catch (err) {
          console.error("Data WebSocket parse error:", err);
        }
      };
    } catch (e) {
      console.warn("ws/data 연결 실패:", e);
    }

    return () => {
      try {
        wsImage?.close();
      } catch {}
      try {
        wsData?.close();
      } catch {}
    };
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Data Collection Monitoring
      </h1>

      {/* 상단: Sensor(좌) + DatasetConfig(우) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 w-full">
        <div className="lg:col-span-8">
          <SensorInfo cameraImages={cameraImages} />
        </div>
        <div className="lg:col-span-4">
          <DatasetConfig
            datasetName={dsConfig.datasetName}
            sessionId={dsConfig.sessionId}
            operator={dsConfig.operator}
            dateTime={dsConfig.dateTime}
            task={dsConfig.task}
            robotModel={dsConfig.robotModel}
            handModel={dsConfig.handModel}
            environment={dsConfig.environment}
            controlMode={dsConfig.controlMode}
            rgb={dsConfig.rgb}
          />
        </div>
      </div>

      {/* 하단: RobotInfo */}
      <div className="w-full">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <RobotInfo
            leftjointAngles={leftjointAngles}
            rightjointAngles={rightjointAngles}
            leftcartesianCoords={leftcartesianCoords}
            rightcartesianCoords={rightcartesianCoords}
            lefthandAngles={lefthandAngles}
            righthandAngles={righthandAngles}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
