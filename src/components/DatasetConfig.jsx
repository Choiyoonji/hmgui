import React from "react";

/** 
 * 가독성 우선 패널
 * - 좌: 라벨(고정 너비, 작은 대문자, 희미한 색)
 * - 우: 값(모노스페이스, 약한 박스, 높은 대비)
 * - 행 사이 얇은 구분선으로 스캔 용이
 */
const RowKV = ({ label, children }) => (
  <div className="grid grid-cols-12 items-center py-2 border-b border-gray-100 last:border-b-0">
    <div className="col-span-4 pr-3">
      <span className="text-[11px] tracking-wide uppercase text-gray-500">
        {label}
      </span>
    </div>
    <div className="col-span-8">
      <div className="inline-flex min-h-[28px] items-center px-2 rounded border border-gray-200 bg-white font-mono text-sm text-gray-900">
        {children}
      </div>
    </div>
  </div>
);

function DatasetConfig({
  datasetName = "dataset_001",
  sessionId = "session_A",
  operator = "user01",
  dateTime = new Date().toLocaleString(),
  task = "Pick and Place",
  robotModel = "UR5e",
  handModel = "Allegro Hand",
  environment = "Simulation",
  controlMode = "Position Control",
  rgb = { res: "640x480", fps: 30 },
}) {
  return (
    <section className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <header className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl md:text-2xl font-bold text-neutral-900">Dataset Config</h2>
      </header>

      <div className="px-6 py-4">
        <RowKV label="Dataset Name">{datasetName}</RowKV>
        <RowKV label="Session ID">{sessionId}</RowKV>

        <RowKV label="Operator">{operator}</RowKV>
        <RowKV label="Date-Time">{dateTime}</RowKV>

        <RowKV label="Task (prompt)">{task}</RowKV>

        <RowKV label="Robot Model">{robotModel}</RowKV>
        <RowKV label="Hand Model">{handModel}</RowKV>

        <RowKV label="Environment">{environment}</RowKV>
        <RowKV label="Control Mode">{controlMode}</RowKV>

        <RowKV label="RGB Camera">
          {`${rgb?.res ?? "640x480"} @ ${rgb?.fps ?? 30}fps`}
        </RowKV>
      </div>
    </section>
  );
}

export default DatasetConfig;
