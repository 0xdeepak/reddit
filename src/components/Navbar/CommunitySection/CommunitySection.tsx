import {
	Flex,
	Menu,
	MenuButton,
	Text,
	MenuList,
	Icon,
	Button,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { TiHome } from "react-icons/ti";
import CommunityMenuList from "./CommunityMenuList";

interface CommunitySectionProps {
	user?: any | null;
}

const CommunitySection: FunctionComponent<CommunitySectionProps> = (props) => {
	return (
		<>
			<Menu>
				<MenuButton
					as={Button}
					rightIcon={<ChevronDownIcon boxSize="20px" color="gray.700" />}
					padding="4px"
					marginLeft="16px"
					minWidth="60px"
					height="auto"
					backgroundColor="#FFFF"
					_hover={{ border: "1px solid", borderColor: "gray.100" }}
					_active={{ backgroundColor: "#FFFF" }}
				>
					<Flex alignItems="center">
						<Icon
							as={TiHome}
							height="24px"
							width="24px"
							color="gray.600"
						></Icon>
						<Text
							as="h1"
							fontWeight="600"
							fontSize="14px"
							width="190px"
							display={{ base: "none", lg: "flex" }}
							marginLeft="8px"
						>
							Home
						</Text>
					</Flex>
				</MenuButton>
				<MenuList width="260px">
					<CommunityMenuList user={props.user}></CommunityMenuList>
				</MenuList>
			</Menu>
		</>
	);
};

export default CommunitySection;
