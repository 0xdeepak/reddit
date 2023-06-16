import { Community, communitySnippet } from "@/atoms/communityAtom";
import { firestore } from "@/firebase/clientApp";
import { Box, Text, Image, Flex, SkeletonText } from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { FunctionComponent, useCallback, useEffect, useState } from "react";

interface RecommendationsProps {
	isUser: boolean;
	userSnippets: communitySnippet[];
}

const Recommendations: FunctionComponent<RecommendationsProps> = ({
	isUser,
	userSnippets,
}) => {
	const [communities, setCommunities] = useState<Community[]>([]);
	const [dataFetching, setDataFetching] = useState(true);

	// get top 5 communities
	const fetchRecommendations = useCallback(async () => {
		try {
			const comQuery = query(
				collection(firestore, "communities"),
				orderBy("membersCount", "desc"),
				limit(5)
			);
			const snapshot = await getDocs(comQuery);
			const communitiesArr = snapshot.docs.map(
				(doc) => doc.data() as Community
			);
			setCommunities(communitiesArr);
		} catch (error: any) {
			console.log("error getting community recommendation", error.message);
		} finally {
			setDataFetching(false);
		}
	}, []);

	useEffect(() => {
		fetchRecommendations();
	}, [fetchRecommendations]);

	const checkIsJoined = (communityName: string) => {
		for (const snippet of userSnippets) {
			if (snippet.communityName.toLowerCase() === communityName.toLowerCase()) {
				return true;
			}
		}
		return false;
	};

	return (
		<Box
			width="302px"
			display={{ base: "none", lg: "block" }}
			marginLeft="24px"
			flexShrink="0"
		>
			<Box
				borderRadius="6px"
				overflow="hidden"
				backgroundColor="#fff"
				border="1px solid"
				borderColor="gray.400"
				marginBottom="20px"
			>
				<Box position="relative">
					<Image
						alt="reddit art image"
						src={
							isUser
								? "/images/redditPersonalHome.png"
								: "/images/recCommsArt.png"
						}
						maxWidth="100%"
					/>
					<Flex
						position="absolute"
						top="0"
						left="0"
						direction="column"
						height="full"
						width="full"
						justifyContent="flex-end"
						padding="10px 16px"
						backdropFilter="brightness(75%)"
					>
						<Text
							fontSize="16px"
							fontWeight="700"
							color="#fff"
							backdropFilter="b"
						>
							Top Communities
						</Text>
					</Flex>
				</Box>
				{dataFetching && (
					<Box padding="12px">
						<SkeletonText noOfLines={5} skeletonHeight={5} spacing={4} />
					</Box>
				)}
				{communities.map((community, index) => (
					<Flex
						key={community.name}
						padding="12px"
						borderBottom="1px solid"
						borderBottomColor="gray.200"
						alignItems="center"
						position="relative"
					>
						<Text fontSize="14px">{index + 1}</Text>
						<Link
							href={`/r/${community.name}`}
							style={{
								display: "flex",
								alignItems: "center",
								marginLeft: "32px",
							}}
						>
							<Image
								src={community.logoUrl || "/images/redditUserLogo.svg"}
								alt={`${community} logo`}
								height="26px"
								width="26px"
								borderRadius="50%"
							/>
							<Text
								fontSize="14px"
								marginLeft="8px"
								_hover={{ textDecoration: "underline" }}
							>{`r/${community.name}`}</Text>
						</Link>
						{checkIsJoined(community.name) && (
							<Text
								fontSize="12px"
								fontWeight="600"
								borderRadius="2rem"
								padding="4px 12px"
								color="blue.500"
								backgroundColor="blue.100"
								position="absolute"
								right="12px"
								cursor="default"
							>
								Joined
							</Text>
						)}
					</Flex>
				))}
			</Box>
		</Box>
	);
};

export default Recommendations;
