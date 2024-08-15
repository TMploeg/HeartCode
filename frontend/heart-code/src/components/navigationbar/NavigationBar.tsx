import NavigationBarButton from "./NavigationBarButton";
import "./NavigationBar.css";
import { IconType } from "react-icons";
import { AppRoute } from "../../enums/AppRoute";
import { BsFillPersonFill, BsChat, BsSearch } from "react-icons/bs";

interface Props {
  currentPage: String;
}

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
        icon: BsSearch,
      },
      {
        path: AppRoute.MATCHES,
        icon: BsChat,
      },
    ];
  }
}

interface ButtonData {
  path: AppRoute;
  icon: IconType;
}
