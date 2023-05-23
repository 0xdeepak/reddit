import { FunctionComponent } from "react";
import { MenuItem, MenuGroup, Icon, Text } from "@chakra-ui/react";
import { GrAdd } from "react-icons/gr";
import { TiHome } from "react-icons/ti";
import { BsArrowUpRightCircle } from "react-icons/bs";

interface CommunityMenuListProps {}

const CommunityMenuList: FunctionComponent<CommunityMenuListProps> = () => {
	return (
		<>
			<MenuGroup title="YOUR COMMUNITIES" fontSize="10" color="gray.500" fontWeight="400">
				<MenuItem _hover={{ backgroundColor: "#FFFF" }} padding="8px 24px" >
					<Icon as={GrAdd} height="18px" width="18px" marginRight="8px" color="gray.600"></Icon>
					<Text fontSize="14px" fontWeight="500">
						Create Community
					</Text>
				</MenuItem>
			</MenuGroup>
      <MenuGroup title="FEEDS" fontSize="10" color="gray.500" fontWeight="400">
				<MenuItem _hover={{ backgroundColor: "#FFFF" }} padding="8px 24px" >
					<Icon as={TiHome} height="18px" width="18px" marginRight="8px" color="gray.600"></Icon>
					<Text fontSize="14px" fontWeight="500">
						Home
					</Text>
				</MenuItem>
        <MenuItem _hover={{ backgroundColor: "#FFFF" }} padding="8px 24px" >
					<Icon as={BsArrowUpRightCircle} height="18px" width="18px" marginRight="8px" color="gray.600"></Icon>
					<Text fontSize="14px" fontWeight="500">
						Popular
					</Text>
				</MenuItem>
			</MenuGroup>
		</>
	);
};

export default CommunityMenuList;
