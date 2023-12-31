"use client";
import { FunctionComponent, useEffect, useState } from "react";
import { ChakraProvider, Flex, Box } from "@chakra-ui/react";
import { theme } from "@/chakra/theme";
import Header from "./header";
import useCommunityData from "@/hooks/useCommunityData";
import AboutCommunity from "./aboutCommunity";
import Posts from "@/components/Posts/Posts";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/atoms/userAtom";

interface CommunityPageProps {
	params: { communityId: string };
}

const CommunityPage: FunctionComponent<CommunityPageProps> = ({
	params: { communityId },
}) => {
	const currentUser = useRecoilValue(userAtom);
	const { communityData } = useCommunityData();
	const [userRole, setUserRole] = useState("none");

	useEffect(() => {
		if (communityData.currentCommunity?.creatorId) {
			if (
				communityData.userCommunitySnippets.length == 0 ||
				!currentUser.user
			) {
				setUserRole("none");
				return;
			}
			for (const el of communityData.userCommunitySnippets) {
				if (el.communityName.toLowerCase() === communityId.toLowerCase()) {
					if (
						communityData.currentCommunity.creatorId === currentUser.user.uid
					) {
						setUserRole("admin");
					} else {
						setUserRole("member");
					}
					return;
				}
			}
			setUserRole("none");
		}
	}, [
		communityData.currentCommunity?.creatorId,
		communityData.userCommunitySnippets,
		communityId,
		currentUser.user,
	]);

	return (
		<ChakraProvider theme={theme}>
			<Box flexGrow="1" backgroundColor="gray.300">
				<Header currentUser={currentUser} userRole={userRole}></Header>
				<Flex
					maxWidth="1008px"
					// maxWidth="1320px"
					width="full"
					margin="auto"
					padding="20px 16px"
				>
					{/* <Box
						width="312px"
						display={{ base: "none", lg: "block" }}
						marginRight="24px"
						flexShrink="5"
					/> */}
					<Posts
						communityData={communityData}
						currentUser={currentUser}
						userRole={userRole}
					/>
					<AboutCommunity
						communityData={communityData.currentCommunity}
						communityId={communityId}
						userRole={userRole}
					></AboutCommunity>
				</Flex>
			</Box>
		</ChakraProvider>
	);
};

export default CommunityPage;
