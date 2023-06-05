import { FunctionComponent, useEffect, useState } from "react";
import { MenuItem, MenuGroup, Icon, Text } from "@chakra-ui/react";
import { GrAdd } from "react-icons/gr";
import { TiHome } from "react-icons/ti";
import { BsArrowUpRightCircle } from "react-icons/bs";
import CreateCommunityModal from "../../Modals/CreateCommunity/CreateCommunityModal";
import { User } from "@firebase/auth";

interface CommunityMenuListProps {
	user?: any | null;
}

const CommunityMenuList: FunctionComponent<CommunityMenuListProps> = (
	props
) => {
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

	return (
		<>
			{modalOpen.value && (
				<CreateCommunityModal
					closeModal={closeModal}
					closeWithNavigate={closeWithNavigate}
					user={props.user}
				></CreateCommunityModal>
			)}
			<MenuGroup
				title="YOUR COMMUNITIES"
				fontSize="10"
				color="gray.500"
				fontWeight="400"
			>
				<MenuItem
					_hover={{ backgroundColor: "#FFFF" }}
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
			</MenuGroup>
			<MenuGroup title="FEEDS" fontSize="10" color="gray.500" fontWeight="400">
				<MenuItem _hover={{ backgroundColor: "#FFFF" }} padding="8px 24px">
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
				<MenuItem _hover={{ backgroundColor: "#FFFF" }} padding="8px 24px">
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
				</MenuItem>
			</MenuGroup>
		</>
	);
};

export default CommunityMenuList;
