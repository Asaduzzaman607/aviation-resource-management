import { Card } from "antd";
import {useSelector} from "react-redux";

type Props = {
  permission: string[] | string,
  showFallback?: boolean,
  children: JSX.Element,
  fallback?: JSX.Element
}

type AccessRight = {
  [key: number]: any
}

const SUPER_ADMIN_ROLE_ID = 1;

export default function Permission(props: Props) {
  
  const style = {
        width: '80vw',
        height: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        font: 'bold',
        fontSize: '30px',
        color: 'red'
  }

  const { permission, showFallback, children, fallback} = props;

  const userAccessRights = useSelector((state: any) => state.user.userAccessPermissions) as  AccessRight;
  const isSuperAdmin = useSelector((state: any) => state.user.roleId === SUPER_ADMIN_ROLE_ID) as boolean;

  if (isSuperAdmin) {
    return children;
  }
  
  // permission not defined that's why default;will remove after all permission defined
  // if (typeof permission === "string" && permission === '') {
  //   return children;
  // }

  const hasPermission = (permission: string[] | string) => {
    if (typeof permission === "string") {
      return userAccessRights.hasOwnProperty(permission);
    }

    return permission?.some((p: string) => userAccessRights.hasOwnProperty(p))
  }

  if (hasPermission(permission)) {
    return children;
  }

  if (!showFallback) {
    return null;
  }

  // if (fallback) {
  //   return fallback;
  // }

  return <Card>
            <h1 style={style}>
                You don't have permission to perform this action
            </h1>
        </Card>
}

Permission.defaultProps = {
  showFallback: false
}