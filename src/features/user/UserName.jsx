import { useSelector } from "react-redux";

function UserName() {
  const userName = useSelector((state) => state.user.userName);

  if (!userName) return null;

  return <h3 className="hidden text-sm font-semibold md:block">{userName}</h3>;
}

export default UserName;
