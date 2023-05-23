import { AuthModalState } from "@/atoms/authModalAtom";
import { FunctionComponent } from "react";
import { SetterOrUpdater } from "recoil";
import { MenuItem } from "@chakra-ui/menu";
import { MdOutlineLogin } from "react-icons/md";
import { Text } from "@chakra-ui/react";
import Icon from "@chakra-ui/icon";

interface NoUserMenuListProps {
	setModalState: SetterOrUpdater<AuthModalState>;
}

const NoUserMenuList: FunctionComponent<NoUserMenuListProps> = ({ setModalState }) => {
	const handleClick = () => {
		setModalState((prevState) => ({
			...prevState,
			open: true,
			view: "login",
		}));
	};

	return (
		<>
			<MenuItem _hover={{ backgroundColor: "#FFFF" }} onClick={handleClick}>
				<Icon
					as={MdOutlineLogin}
					height="20px"
					width="20px"
					marginRight="16px"
				></Icon>
				<Text fontSize="14px" fontWeight="500">
					Login/Signup
				</Text>
			</MenuItem>
		</>
	);
};

export default NoUserMenuList;
