import { communityState } from "@/atoms/communityAtom";
import { Box, Flex, Text, Image, SkeletonText } from "@chakra-ui/react";
import Link from "next/link";
import { FunctionComponent } from "react";

interface AboutCommunityProps {
	communityData: communityState;
}

const AboutCommunity: FunctionComponent<AboutCommunityProps> = ({
	communityData,
}) => {
	if (!communityData.currentCommunity) {
		return (
			<Box
				width="302px"
				display={{ base: "none", lg: "block" }}
				marginLeft="24px"
				flexShrink="0"
			>
				<Box padding="12px" backgroundColor="#fff" borderRadius="6px">
					<SkeletonText noOfLines={1} marginBottom="32px" skeletonHeight={6} />
					<SkeletonText
						noOfLines={2}
						marginBottom="24px"
						skeletonHeight={4}
						spacing={3}
					/>
					<SkeletonText
						noOfLines={2}
						marginBottom="32px"
						skeletonHeight={4}
						spacing={3}
					/>
					<SkeletonText noOfLines={1} marginBottom="8px" skeletonHeight={6} />
				</Box>
			</Box>
		);
	}
	return (
		<Box
			width="302px"
			display={{ base: "none", lg: "block" }}
			marginLeft="24px"
			flexShrink="0"
		>
			<Box
				borderRadius="4px"
				overflow="hidden"
				backgroundColor="#fff"
				border="1px solid"
				borderColor="gray.400"
			>
				<Box padding="12px" backgroundColor="#0079d3">
					<Text fontSize="14px" fontWeight="600" color="#FFF">
						About Community
					</Text>
				</Box>
				<Box padding="0 12px">
					<Flex alignItems="center" paddingTop="16px">
						<Image
							alt="community logo"
							src={
								communityData.currentCommunity?.logoUrl ||
								"/images/redditUserLogo.svg"
							}
							borderRadius="100%"
							objectFit="cover"
							objectPosition="center"
							backgroundColor="#fff"
							height="52px"
							width="52px"
							marginRight="16px"
						/>
						<Link href={`/r/${communityData.currentCommunity?.name}`}>
							<Text
								fontSize="16px"
								fontWeight="600"
							>{`r/${communityData.currentCommunity?.name}`}</Text>
						</Link>
					</Flex>
					<Text fontSize="14px" padding="12px 0px">
						{communityData.currentCommunity?.about || "-"}
					</Text>
					<Text
						fontSize="14px"
						color="gray.400"
						fontWeight="500"
						paddingBottom="12px"
						borderBottom="1px solid"
						borderColor="gray.200"
					>
						Created{" "}
						{communityData.currentCommunity?.createdAt
							.toDate()
							.toLocaleDateString("en-US", {
								year: "numeric",
								month: "short",
								day: "numeric",
							})}
					</Text>
					<Flex padding="12px 0">
						<Flex direction="column" alignItems="center">
							<Text fontSize="16px" fontWeight="600">
								{communityData.currentCommunity?.membersCount}
							</Text>
							<Text fontSize="12px" color="gray.500">
								Members
							</Text>
						</Flex>
					</Flex>
				</Box>
			</Box>
		</Box>
	);
};

export default AboutCommunity;
