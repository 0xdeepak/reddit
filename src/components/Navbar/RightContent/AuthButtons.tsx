import { Button } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Flex } from "@chakra-ui/layout";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";

const AuthButtons: FunctionComponent = () => {
	const setModalState = useSetRecoilState(authModalState);

	const handleLoginClick = () => {
		setModalState((prevState) => ({
			...prevState,
			open: true,
			view: "login",
		}));
	};

	return (
		<>
			<Button
				fontSize="14px"
				fontWeight="700"
				backgroundColor="#edeff1"
				borderRadius="2rem"
				width={{ base: "76px", lg: "116px" }}
				height="32px"
				display={{ base: "none", md: "flex" }}
			>
				Get App
			</Button>
			<Button
				fontSize="14px"
				fontWeight="700"
				backgroundColor="#FF4500"
				color="#FFFF"
				borderRadius="2rem"
				width={{ base: "76px", lg: "116px" }}
				height="32px"
				marginLeft={{ base: "8px", lg: "16px" }}
				display={{ base: "none", md: "flex" }}
				onClick={handleLoginClick}
				_hover={{ backgroundColor: "#FF4500" }}
			>
				Log In
			</Button>
		</>
	);
};

export default AuthButtons;
