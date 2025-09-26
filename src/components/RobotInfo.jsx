import React from "react";

// 안전 숫자 포맷터
const f = (v, d=3) => Number.isFinite(+v) ? (+v).toFixed(d) : (0).toFixed(d);

/* 표 셀: 꽉 찬 칸 + 중앙정렬 */
const Cell = ({ children }) => (
  <div className="h-9 rounded-md border border-gray-200 bg-white
                  flex items-center justify-center
                  font-mono tabular-nums text-sm text-gray-900">
    {children}
  </div>
);

/* ✅ 컬러 라벨 버전 */
const LabelCell = ({ children, variant = "default" }) => {
  const base =
    "h-9 rounded-md border border-gray-200 flex items-center justify-center text-xs font-semibold px-2";
  const variants = {
    default: "bg-gray-50 text-gray-700",
    pos: "bg-green-100 text-green-700",
    quat: "bg-blue-100 text-blue-700",
    joint: "bg-purple-100 text-purple-700",
  };
  return <div className={`${base} ${variants[variant]}`}>{children}</div>;
};

/* ✅ Pose: XYZ + WXYZ — 안전 포맷터 f() 사용 */
const PoseRowLong = ({ arr }) => {
  const [x = 0, y = 0, z = 0, w = 1, qx = 0, qy = 0, qz = 0] = arr ?? [];
  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns:
          "auto repeat(3, minmax(0,1fr)) auto repeat(4, minmax(0,1fr))",
      }}
    >
      <LabelCell variant="pos">Position (XYZ)</LabelCell>
      <Cell>{f(x, 2)}</Cell>
      <Cell>{f(y, 2)}</Cell>
      <Cell>{f(z, 2)}</Cell>

      <LabelCell variant="quat">Quaternion (WXYZ)</LabelCell>
      <Cell>{f(w, 2)}</Cell>
      <Cell>{f(qx, 2)}</Cell>
      <Cell>{f(qy, 2)}</Cell>
      <Cell>{f(qz, 2)}</Cell>
    </div>
  );
};


/* ✅ Joint Angles */
const JointRow = ({ values = [], digits = 1, dof = 7 }) => (
  <div
    className="grid gap-2"
    style={{
      gridTemplateColumns: `auto repeat(${dof}, minmax(0,1fr))`,
    }}
  >
    <LabelCell variant="joint">{`Joint Angles (${dof})`}</LabelCell>
    {Array.from({ length: dof }).map((_, i) => (
      <Cell key={i}>
        {`${Number(values[i] ?? 0).toFixed(digits)}°`}
      </Cell>
    ))}
  </div>
);


const SectionCard = ({ title, children }) => (
  <section className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
    <h3 className="text-sm font-semibold text-gray-800 mb-3 tracking-wide">{title}</h3>
    <div className="space-y-3">{children}</div>
  </section>
);

function RobotInfo({
  leftjointAngles = [0,0,0,0,0,0,0],
  rightjointAngles = [0,0,0,0,0,0,0],
  leftcartesianCoords = [0,0,0,1,0,0,0],
  rightcartesianCoords = [0,0,0,1,0,0,0],
  lefthandAngles = [0,0,0,0,0,0],
  righthandAngles = [0,0,0,0,0,0],
}) {
  return (
    <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200">
      <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-5">Observation (Robot State)</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title="Left Arm">
          <PoseRowLong arr={leftcartesianCoords} />
          <JointRow label="Joint Angles" values={leftjointAngles} />
        </SectionCard>

        <SectionCard title="Right Arm">
          <PoseRowLong arr={rightcartesianCoords} />
          <JointRow label="Joint Angles" values={rightjointAngles} />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        <SectionCard title="Left Hand">
          <JointRow label="Joint Angles" values={lefthandAngles} dof={6}/>
        </SectionCard>
        <SectionCard title="Right Hand">
          <JointRow label="Joint Angles" values={righthandAngles} dof={6} />
        </SectionCard>
      </div>
    </div>
  );
}

export default RobotInfo;
