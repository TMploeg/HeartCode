import NavigationBarButton from "./NavigationBarButton";
import "./NavigationBar.css";
import {
  BsFillPersonFill,
  BsChat,
  BsHouseDoorFill,
  BsPersonPlusFill,
  BsFilePersonFill,
} from "react-icons/bs";
import { IconType } from "react-icons";

interface Props {
  currentPage: string;
}

const Icon: IconType = BsFilePersonFill;

export default function NavigationBar({ currentPage }: Props) {
  return (
    <div className="nav-bar">
      {getButtons().map((buttonData) => {
        const Icon: IconType = buttonData.icon;
        return (
          <NavigationBarButton
            page={buttonData.path}
            icon={<Icon />}
            className={
              buttonData.path === currentPage ? "current-page" : undefined
            }
          />
        );
      })}
      {/* <NavigationBarButton page="account" icon={<BsFillPersonFill />} />
      <NavigationBarButton page="" icon={<BsHouseDoorFill />} />
      <NavigationBarButton page="matches" icon={<BsChat />} />
      <NavigationBarButton page="register" icon={<BsPersonPlusFill />} />
      <NavigationBarButton page="login" icon={<BsFilePersonFill />} /> */}
    </div>
  );

  function getButtons(): ButtonData[] {
    return [
      {
        path: "/account",
        icon: BsFillPersonFill,
      },
      {
        path: "/",
        icon: BsHouseDoorFill,
      },
      {
        path: "/matches",
        icon: BsChat,
      },
      {
        path: "/register",
        icon: BsPersonPlusFill,
      },
      {
        path: "/login",
        icon: BsFilePersonFill,
      },
    ];
  }
}

interface ButtonData {
  path: string;
  icon: IconType;
}
