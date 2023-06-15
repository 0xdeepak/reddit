import { FunctionComponent, useEffect, useState } from "react";
import { MenuItem, MenuGroup, Icon, Text } from "@chakra-ui/react";
import { GrAdd } from "react-icons/gr";
import { TiHome } from "react-icons/ti";
import CreateCommunityModal from "../../Modals/CreateCommunity/CreateCommunityModal";
import Link from "next/link";
import { communitySnippet } from "@/atoms/communityAtom";
import CommunityListItem from "./CommunityListItem";

interface CommunityMenuListProps {
	user?: any | null;
	communitySnippets: communitySnippet[];
}

const CommunityMenuList: FunctionComponent<CommunityMenuListProps> = ({
	user,
	communitySnippets,
}) => {
	const [moderatingCommunities, setModeratingCommunities] = useState<
		communitySnippet[]
	>([]);
	const [modalOpen, setModalOpen] = useState({
		value: false,
		isCallback: false,
		callback: () => {},
	});

	useEffect(() => {
		if (!modalOpen.value && modalOpen.isCallback) {
			modalOpen.callback();
		}
	}, [modalOpen]);

	const openModal = () => {
		setModalOpen((prevVal) => ({
			...prevVal,
			value: true,
		}));
	};

	const closeModal = () => {
		console.log("closing mdl");
		setModalOpen({
			value: false,
			isCallback: false,
			callback: () => {},
		});
	};

	const closeWithNavigate = (cb: () => void) => {
		setModalOpen({
			value: false,
			isCallback: true,
			callback: cb,
		});
	};

	useEffect(() => {
		setModeratingCommunities(
			communitySnippets.filter((snippet) => snippet.isModerator)
		);
	}, [communitySnippets]);

	return (
		<>
			{modalOpen.value && (
				<CreateCommunityModal
					closeModal={closeModal}
					closeWithNavigate={closeWithNavigate}
					user={user}
				></CreateCommunityModal>
			)}
			{moderatingCommunities.length > 0 && (
				<MenuGroup
					title="MODERATING"
					fontSize="10"
					color="gray.500"
					fontWeight="400"
				>
					{moderatingCommunities.map((snippet) => (
						<CommunityListItem
							key={snippet.communityName}
							communityName={snippet.communityName}
							logoUrl={snippet.logoUrl || "/images/redditUserLogo.svg"}
						/>
					))}
				</MenuGroup>
			)}
			<MenuGroup
				title="YOUR COMMUNITIES"
				fontSize="10"
				color="gray.500"
				fontWeight="400"
			>
				<MenuItem
					_hover={{ backgroundColor: "gray.100" }}
					padding="8px 24px"
					onClick={openModal}
				>
					<Icon
						as={GrAdd}
						height="18px"
						width="18px"
						marginRight="8px"
						color="gray.600"
					></Icon>
					<Text fontSize="14px" fontWeight="500">
						Create Community
					</Text>
				</MenuItem>
				{communitySnippets.map((snippet) => (
					<CommunityListItem
						key={snippet.communityName}
						communityName={snippet.communityName}
						logoUrl={snippet.logoUrl || "/images/redditUserLogo.svg"}
					/>
				))}
			</MenuGroup>
			<MenuGroup title="FEEDS" fontSize="10" color="gray.500" fontWeight="400">
				<Link href="/">
					<MenuItem _hover={{ backgroundColor: "gray.100" }} padding="8px 24px">
						<Icon
							as={TiHome}
							height="18px"
							width="18px"
							marginRight="8px"
							color="gray.600"
						></Icon>
						<Text fontSize="14px" fontWeight="500">
							Home
						</Text>
					</MenuItem>
				</Link>
				{/* <MenuItem _hover={{ backgroundColor: "#FFFF" }} padding="8px 24px">
					<Icon
						as={BsArrowUpRightCircle}
						height="18px"
						width="18px"
						marginRight="8px"
						color="gray.600"
					></Icon>
					<Text fontSize="14px" fontWeight="500">
						Popular
					</Text>
				</MenuItem> */}
			</MenuGroup>
		</>
	);
};

export default CommunityMenuList;
