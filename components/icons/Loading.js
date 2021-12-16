export default function Loading() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{
        margin: "auto",
        background: "none",
        display: "block",
        shapeRendering: "auto",
      }}
      width="71px"
      height="71px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <rect x="15" y="30" width="10" height="40" fill="#d7689d">
        <animate
          attributeName="opacity"
          dur="1s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          values="1;0.2;1"
          begin="-0.6"
        />
      </rect>
      <rect x="35" y="30" width="10" height="40" fill="#f3d337">
        <animate
          attributeName="opacity"
          dur="1s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          values="1;0.2;1"
          begin="-0.4"
        />
      </rect>
      <rect x="55" y="30" width="10" height="40" fill="#a0c443">
        <animate
          attributeName="opacity"
          dur="1s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          values="1;0.2;1"
          begin="-0.2"
        />
      </rect>
      <rect x="75" y="30" width="10" height="40" fill="#66b5ae">
        <animate
          attributeName="opacity"
          dur="1s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
          values="1;0.2;1"
          begin="-1"
        />
      </rect>
    </svg>
  );
}
