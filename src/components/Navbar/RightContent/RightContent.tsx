import { Flex } from "@chakra-ui/layout";
import { FunctionComponent } from "react";
import AuthButtons from "./AuthButtons";
import AuthModal from "@/components/Modals/AuthModal/AuthModal";
import { User } from "@firebase/auth";
import IconsSection from "./IconsSection";
import UserMenu from "./UserMenu/UserMenu";

interface RightContentProps {
	user?: User | null;
}

const RightContent: FunctionComponent<RightContentProps> = (props) => {
	return (
		<>
			<AuthModal></AuthModal>
			<Flex align="center" justify="center">
				{props.user ? <IconsSection></IconsSection> : <AuthButtons></AuthButtons>}
				<UserMenu user={props.user} ></UserMenu>
			</Flex>
		</>
	);
};

export default RightContent;
