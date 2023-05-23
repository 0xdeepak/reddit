import { IconButton } from "@chakra-ui/button";
import { Flex } from "@chakra-ui/layout";
import { FunctionComponent } from "react";
import { BsArrowUpRightCircle, BsChatDots } from "react-icons/bs";
import { MdOutlineMonetizationOn } from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";
import { GrAdd } from "react-icons/gr";

interface IconsSectionProps {}

const IconsSection: FunctionComponent<IconsSectionProps> = () => {
	return (
		<>
			<Flex
				borderRight="1px solid"
        borderColor="gray.200"
				paddingRight="8px"
				marginRight="8px"
        display={{base: "none", md: "flex"}}
			>
				<IconButton
					aria-label="Popular"
					title="Popular"
					minWidth="32px"
					height="32px"
					backgroundColor="#FFFF"
					_hover={{ backgroundColor: "gray.100" }}
					borderRadius="0px"
					icon={<BsArrowUpRightCircle size="20px"></BsArrowUpRightCircle>}
				></IconButton>
				<IconButton
					aria-label="Coin"
					title="Coin"
					minWidth="32px"
					height="32px"
					marginLeft="8px"
					backgroundColor="#FFFF"
					_hover={{ backgroundColor: "gray.100" }}
					borderRadius="0px"
					icon={<MdOutlineMonetizationOn size="24px"></MdOutlineMonetizationOn>}
				></IconButton>
			</Flex>
			<IconButton
				aria-label="Chat"
				title="Chat"
				minWidth="32px"
				height="32px"
				backgroundColor="#FFFF"
				_hover={{ backgroundColor: "gray.100" }}
				borderRadius="0px"
				icon={<BsChatDots size="20px"></BsChatDots>}
			></IconButton>
			<IconButton
				aria-label="Notifications"
				title="Notifications"
				minWidth="32px"
				height="32px"
				marginLeft="8px"
				backgroundColor="#FFFF"
				_hover={{ backgroundColor: "gray.100" }}
				borderRadius="0px"
				icon={<IoNotificationsOutline size="20px"></IoNotificationsOutline>}
			></IconButton>
      <IconButton
				aria-label="Create Post"
				title="Create Post"
				minWidth="32px"
				height="32px"
				marginLeft="8px"
				backgroundColor="#FFFF"
				_hover={{ backgroundColor: "gray.100" }}
				borderRadius="0px"
				icon={<GrAdd size="20px"></GrAdd>}
			></IconButton>
		</>
	);
};

export default IconsSection;
