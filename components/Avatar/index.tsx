import Avvvatars from "avvvatars-react";

export type AvatarProps = {
  value: string;
  size?: number;
  style?: "shape" | "character";
};

const Avatar = (props: AvatarProps) => {
  return <Avvvatars {...props} style={props?.style || "shape"} />;
};

export default Avatar;
