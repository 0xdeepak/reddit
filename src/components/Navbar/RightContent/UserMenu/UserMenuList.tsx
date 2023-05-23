import Icon from "@chakra-ui/icon";
import { MenuItem, MenuDivider } from "@chakra-ui/menu";
import { FunctionComponent } from "react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
import { Text } from "@chakra-ui/react";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";

interface UserMenuListProps {}

const UserMenuList: FunctionComponent<UserMenuListProps> = () => {
	const [signOut, loading, error] = useSignOut(auth);

	const goToProfile = () => {};

	const handleLogout = () => {
		signOut().then(() => {});
	};

	return (
		<>
			<MenuItem _hover={{ backgroundColor: "#FFFF" }} onClick={goToProfile}>
				<Icon
					as={CgProfile}
					height="20px"
					width="20px"
					marginRight="16px"
				></Icon>
				<Text fontSize="14px" fontWeight="500">
					Profile
				</Text>
			</MenuItem>
      <MenuDivider></MenuDivider>
			<MenuItem _hover={{ backgroundColor: "#FFFF" }} onClick={handleLogout}>
				<Icon
					as={MdOutlineLogin}
					height="20px"
					width="20px"
					marginRight="16px"
				></Icon>
				<Text fontSize="14px" fontWeight="500">
					Logout
				</Text>
			</MenuItem>
		</>
	);
};

export default UserMenuList;
