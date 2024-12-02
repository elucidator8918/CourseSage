import { Html, useProgress } from "@react-three/drei";
import { InfinitySpin } from "react-loader-spinner";

const CanvasLoader = () => {
  const { progress } = useProgress();
  return (
    <Html
      as="div"
      center
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <span className="canvas-loader"></span>
      <InfinitySpin width="200" color="gray" />
      <p
        style={{
          fontSize: 14,
          color: "white",
          fontWeight: 800,
          marginTop: 40,
        }}
      >
        <div className="text-gray-600">{progress.toFixed(2)}%</div>
      </p>
    </Html>
  );
};

export default CanvasLoader;
