/* eslint-disable jsx-a11y/alt-text */
import { Community } from "@/atoms/communityAtom";
import { Box, Flex, Heading, Image, Button } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useState } from "react";
import redditUserLogo from "public/images/redditUserLogo.svg";
import { userAtom, userState } from "@/atoms/userAtom";
import useCommunityData from "@/hooks/useCommunityData";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";

interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = () => {
	const { communityData, onJoinOrLeaveCommunity, loading } = useCommunityData();
	const setAuthModalState = useSetRecoilState(authModalState);
	const currentUser = useRecoilValue(userAtom);
	const [isUserMember, setIsUserMember] = useState({
		isMember: false,
		isMod: false,
	});

	useEffect(() => {
		if (communityData.currentCommunity) {
			if (communityData.myCommunitySnippets.length == 0) {
				setIsUserMember({
					isMember: false,
					isMod: false,
				});
				return;
			}
			communityData.myCommunitySnippets.forEach((el) => {
				if (
					el.communityName.toLowerCase() ===
					communityData.currentCommunity?.name.toLowerCase()
				) {
					setIsUserMember({
						isMember: true,
						isMod: el.isModerator,
					});
				}
			});
		}
	}, [communityData]);

	const onJoinClick = () => {
		if (currentUser.user) {
			if (isUserMember.isMember) {
				onJoinOrLeaveCommunity();
			} else {
				onJoinOrLeaveCommunity(communityData.currentCommunity);
			}
		} else {
			setAuthModalState((prevVal) => ({
				...prevVal,
				open: true,
				view: "login",
			}));
		}
	};

	return (
		<>
			<Box
				height="128px"
				backgroundImage={`url(${communityData.currentCommunity?.bannerImage})`}
				backgroundRepeat="no-repeat"
				backgroundSize="cover"
				backgroundColor="blue.300"
			></Box>
			<Box height="78px" background="#FFF">
				<Flex
					maxWidth="984px"
					width="full"
					alignItems="flex-start"
					margin="auto"
					padding="0 16px 0 24px"
				>
					<Image
						src={
							communityData.currentCommunity?.logoUrl ||
							"/images/redditUserLogo.svg"
						}
						backgroundSize="cover"
						height="72px"
						width="72px"
						border="4px solid #FFF"
						borderRadius="100%"
						transform="translate(0, -14px)"
						backgroundColor="#FFF"
					></Image>
					<Box marginLeft="16px">
						<Heading as="h1" fontSize="28px" fontWeight="700" margin="8px 0px">
							{communityData.currentCommunity?.name || ""}
						</Heading>
						<Heading
							as="h2"
							fontSize="14px"
							fontWeight="500"
							color="gray.400"
						>{`r/${communityData.currentCommunity?.name || ""}`}</Heading>
					</Box>
					<Button
						fontSize="14px"
						color={isUserMember.isMember ? "#0079d3" : "#FFF"}
						fontWeight="700"
						backgroundColor={isUserMember.isMember ? "#FFF" : "#0079d3"}
						_hover={{
							backgroundColor: isUserMember.isMember ? "#FFF" : "#0079d3",
							_before: {
								content: !loading
									? isUserMember.isMember
										? '"Leave"'
										: '"Join"'
									: '""',
							},
						}}
						border="1px solid #0079d3"
						borderRadius="2rem"
						width="96px"
						height="32px"
						marginLeft="24px"
						marginTop="16px"
						isLoading={loading}
						onClick={onJoinClick}
						_before={{
							content: !loading
								? isUserMember.isMember
									? '"Joined"'
									: '"Join"'
								: '""',
						}}
					></Button>
				</Flex>
			</Box>
		</>
	);
};

export default Header;
