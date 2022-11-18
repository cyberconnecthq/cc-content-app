import { BallTriangle } from "react-loading-icons";

const Loading = () => (
  <div className="mt-24 h-96 flex flex-col justify-center items-center gap-y-4">
    <div>
      <BallTriangle stroke="#000" />
    </div>
    <span>Loading Posts...</span>
  </div>
);

export default Loading;
