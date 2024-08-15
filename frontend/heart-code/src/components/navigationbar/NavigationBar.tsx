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
import { AppRoute } from "../../enums/AppRoute";

interface Props {
  currentPage: string;
}

const Icon: IconType = BsFilePersonFill;

export default function NavigationBar({ currentPage }: Props) {
  return (
    <div className="nav-bar">
      {getButtons().map((buttonData, index) => {
        const Icon: IconType = buttonData.icon;
        return (
          <NavigationBarButton
            key={index}
            page={buttonData.path}
            icon={<Icon />}
            className={
              buttonData.path === currentPage ? "current-page" : undefined
            }
          />
        );
      })}
    </div>
  );

  function getButtons(): ButtonData[] {
    return [
      {
        path: AppRoute.ACCOUNT,
        icon: BsFillPersonFill,
      },
      {
        path: AppRoute.HOME,
        icon: BsHouseDoorFill,
      },
      {
        path: AppRoute.MATCHES,
        icon: BsChat,
      },
      {
        path: AppRoute.REGISTER,
        icon: BsPersonPlusFill,
      },
      {
        path: AppRoute.LOGIN,
        icon: BsFilePersonFill,
      },
    ];
  }
}

interface ButtonData {
  path: AppRoute;
  icon: IconType;
}
