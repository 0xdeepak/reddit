import {
	Flex,
	Menu,
	MenuButton,
	Text,
	MenuList,
	Icon,
	Button,
	Image,
} from "@chakra-ui/react";
import { FunctionComponent, useEffect, useState } from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { TiHome } from "react-icons/ti";
import CommunityMenuList from "./CommunityMenuList";
import useCommunityData from "@/hooks/useCommunityData";
import { usePathname, useSearchParams } from "next/navigation";
import { communitySnippet } from "@/atoms/communityAtom";

interface CommunitySectionProps {
	user?: any | null;
}

const CommunitySection: FunctionComponent<CommunitySectionProps> = ({
	user,
}) => {
	const { communityData } = useCommunityData();
	const [currentSnippet, setCurrentSnippet] = useState<communitySnippet>();
	const path = usePathname();

	useEffect(() => {
		const arr = path.split("/");
		const id = arr.at(arr.indexOf("r") + 1);
		if (
			id &&
			id.toLowerCase() === communityData.currentCommunity?.name.toLowerCase()
		) {
			setCurrentSnippet({
				communityName: communityData.currentCommunity!.name,
				logoUrl: communityData.currentCommunity?.logoUrl || "",
				isModerator: false,
			});
		} else {
			setCurrentSnippet(undefined);
		}
	}, [communityData.currentCommunity, path]);

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
					_hover={{ border: "1px solid", borderColor: "gray.200" }}
					_active={{ backgroundColor: "#FFFF" }}
				>
					<Flex alignItems="center" flexGrow="1">
						{path === "/" ? (
							<>
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
							</>
						) : (
							<>
								<Image
									src={currentSnippet?.logoUrl || "/images/redditUserLogo.svg"}
									alt={`${currentSnippet?.communityName} logo`}
									height="22px"
									width="22px"
									borderRadius="50%"
									objectFit="cover"
									overflow="hidden"
									visibility={currentSnippet ? "visible" : "hidden"}
								></Image>
								<Text
									as="h1"
									fontWeight="600"
									fontSize="14px"
									width="190px"
									display={{ base: "none", lg: "flex" }}
									marginLeft="12px"
									visibility={currentSnippet ? "visible" : "hidden"}
								>
									{`r/${currentSnippet?.communityName}`}
								</Text>
							</>
						)}
					</Flex>
				</MenuButton>
				<MenuList width="260px" maxHeight="460px">
					<CommunityMenuList
						user={user}
						communitySnippets={communityData.userCommunitySnippets}
					></CommunityMenuList>
				</MenuList>
			</Menu>
		</>
	);
};

export default CommunitySection;
