import { FunctionComponent } from "react";
import {
	Menu,
	MenuButton,
	MenuList,
	Button,
	Flex,
	Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { User } from "@firebase/auth";
import { FaRedditSquare } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { IoSparkles } from "react-icons/io5";
import { Icon } from "@chakra-ui/react";
import UserMenuList from "./UserMenuList";
import NoUserMenuList from "./NoUserMenuList";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";

interface UserMenuProps {
	user?: any | null;
}

const UserMenu: FunctionComponent<UserMenuProps> = ({ user }) => {
	const setModalState = useSetRecoilState(authModalState);
	return (
		<>
			<Menu>
				<MenuButton
					as={Button}
					rightIcon={<ChevronDownIcon boxSize="20px" color="gray.500" />}
					padding="4px"
					marginLeft="16px"
					height="auto"
					backgroundColor="#FFFF"
					_hover={{ border: "1px solid", borderColor: "gray.200" }}
					_active={{ backgroundColor: "#FFFF" }}
				>
					{user ? (
						<Flex alignItems="center">
							<Icon
								as={FaRedditSquare}
								height="24px"
								width="24px"
								color="gray.400"
							></Icon>
							<Flex
								display={{ base: "none", lg: "flex" }}
								flexDirection="column"
								alignItems="flex-start"
								marginLeft="8px"
							>
								<Text fontWeight="500" fontSize="12px">
									{user?.displayName}
								</Text>
								<Flex alignItems="center">
									<Icon
										as={IoSparkles}
										color="#FF4500"
										width="12px"
										height="12px"
										marginRight="8px"
									/>
									<Text color="gray.400" fontSize="12px" fontWeight="500">
										1 karma
									</Text>
								</Flex>
							</Flex>
						</Flex>
					) : (
						<Icon
							as={VscAccount}
							height="24px"
							width="24px"
							color="gray.400"
						></Icon>
					)}
				</MenuButton>
				<MenuList>
					{user ? (
						<UserMenuList></UserMenuList>
					) : (
						<NoUserMenuList setModalState={setModalState}></NoUserMenuList>
					)}
				</MenuList>
			</Menu>
		</>
	);
};

export default UserMenu;
