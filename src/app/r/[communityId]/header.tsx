/* eslint-disable jsx-a11y/alt-text */
import { Community } from "@/atoms/communityAtom";
import { Box, Flex, Heading, Image, Button, Skeleton } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useState } from "react";
import redditUserLogo from "public/images/redditUserLogo.svg";
import { userAtom, userState } from "@/atoms/userAtom";
import useCommunityData from "@/hooks/useCommunityData";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import Link from "next/link";

interface HeaderProps {
	currentUser: userState;
	userRole: string;
}

const Header: FunctionComponent<HeaderProps> = ({ currentUser, userRole }) => {
	const { communityData, onJoinOrLeaveCommunity, loading } = useCommunityData();
	const setAuthModalState = useSetRecoilState(authModalState);

	const onJoinClick = () => {
		if (currentUser.user) {
			if (userRole === "member" || userRole === "admin") {
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
				backgroundImage={`url(${communityData.currentCommunity?.bannerUrl})`}
				backgroundRepeat="no-repeat"
				backgroundSize="cover"
				backgroundPosition="center"
				backgroundColor="blue.300"
			></Box>
			<Box height="78px" background="#FFF">
				<Flex
					maxWidth="1008px"
					width="full"
					alignItems="flex-start"
					margin="auto"
					padding="0 16px"
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
						objectFit="cover"
						objectPosition="center"
					></Image>
					<Flex marginLeft="16px" direction="column" alignItems="flex-start">
						<Skeleton
							isLoaded={!!communityData.currentCommunity}
							minHeight="30px"
							minWidth="100px"
							margin="8px 0px"
						>
							<Heading as="h1" fontSize="28px" fontWeight="700">
								{communityData.currentCommunity?.name}
							</Heading>
						</Skeleton>
						<Skeleton
							isLoaded={!!communityData.currentCommunity}
							minHeight="20px"
							minWidth="60px"
						>
							<Heading
								as="h2"
								fontSize="14px"
								fontWeight="500"
								color="gray.500"
							>{`r/${communityData.currentCommunity?.name}`}</Heading>
						</Skeleton>
					</Flex>
					<Button
						fontSize="14px"
						color={
							userRole === "member" || userRole === "admin" ? "#0079d3" : "#FFF"
						}
						fontWeight="700"
						backgroundColor={
							userRole === "member" || userRole === "admin" ? "#FFF" : "#0079d3"
						}
						_hover={{
							backgroundColor:
								userRole === "member" || userRole === "admin"
									? "#FFF"
									: "#0079d3",
							_before: {
								content: !loading
									? userRole === "member" || userRole === "admin"
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
								? userRole === "member" || userRole === "admin"
									? '"Joined"'
									: '"Join"'
								: '""',
						}}
					></Button>
				</Flex>
			</Box>
			<Box backgroundColor="#FFF">
				<Flex
					maxWidth="984px"
					width="full"
					margin="auto"
					padding="0 16px 0 24px"
				>
					<Link
						href={`/r/${communityData.currentCommunity?.name}`}
						style={{
							fontSize: "14px",
							fontWeight: "500",
							padding: "2px 8px",
							borderBottom: "3px solid #0079d3",
							marginRight: "8px",
						}}
					>
						Posts
					</Link>
				</Flex>
			</Box>
		</>
	);
};

export default Header;
