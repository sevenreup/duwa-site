import { Github } from "lucide-react";

type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  gitHub: (props: IconProps) => <Github {...props} height="23" width="23" />,
};
