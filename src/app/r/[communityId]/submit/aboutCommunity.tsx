import { Community } from "@/atoms/communityAtom";
import AboutCommSkeleton from "@/components/Community/AboutCommSkeleton";
import { Box, Flex, Text, Image } from "@chakra-ui/react";
import Link from "next/link";
import { FunctionComponent } from "react";

interface AboutCommunityProps {
	communityData: Community | null;
}

const AboutCommunity: FunctionComponent<AboutCommunityProps> = ({
	communityData,
}) => {
	if (!communityData) {
		return <AboutCommSkeleton />;
	}

	return (
		<Box
			width="302px"
			display={{ base: "none", lg: "block" }}
			marginLeft="24px"
		>
			<Box
				borderRadius="6px"
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
							src={communityData.logoUrl || "/images/redditUserLogo.svg"}
							borderRadius="100%"
							objectFit="cover"
							objectPosition="center"
							backgroundColor="#fff"
							height="52px"
							width="52px"
							marginRight="16px"
						/>
						<Link href={`/r/${communityData.name}`}>
							<Text
								fontSize="16px"
								fontWeight="600"
							>{`r/${communityData.name}`}</Text>
						</Link>
					</Flex>
					<Text fontSize="14px" padding="12px 0px">
						{communityData.about || "-"}
					</Text>
					<Flex marginBottom="12px" alignItems="center">
						<Text
							fontSize="12px"
							fontWeight="600"
							borderRadius="2rem"
							padding="3px 8px"
							color="blue.500"
							backgroundColor="blue.100"
						>
							{communityData.communityType.charAt(0).toUpperCase() +
								communityData.communityType.slice(1)}
						</Text>
						{communityData.isNsfw && (
							<Text
								fontSize="12px"
								fontWeight="600"
								borderRadius="2rem"
								padding="2px 8px"
								color="red.400"
								backgroundColor="red.100"
								marginLeft="8px"
							>
								NSFW
							</Text>
						)}
					</Flex>
					<Text
						fontSize="14px"
						color="gray.400"
						fontWeight="500"
						paddingBottom="12px"
						borderBottom="1px solid"
						borderColor="gray.200"
					>
						Created{" "}
						{communityData.createdAt.toDate().toLocaleDateString("en-US", {
							year: "numeric",
							month: "short",
							day: "numeric",
						})}
					</Text>
					<Flex padding="12px 0">
						<Flex direction="column" alignItems="center">
							<Text fontSize="16px" fontWeight="600">
								{communityData.membersCount}
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
