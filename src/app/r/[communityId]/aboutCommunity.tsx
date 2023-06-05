import { communityState } from "@/atoms/communityAtom";
import { Box, Button, Text } from "@chakra-ui/react";
import Link from "next/link";
import { FunctionComponent } from "react";

interface AboutCommunityProps {
	communityData: communityState;
	communityId: string;
}

const AboutCommunity: FunctionComponent<AboutCommunityProps> = ({
	communityData,
	communityId,
}) => {
	return (
		<Box
			width="312px"
			display={{ base: "none", lg: "block" }}
			marginLeft="24px"
		>
			<Box borderRadius="4px" overflow="hidden" backgroundColor="#fff">
				<Box padding="12px" backgroundColor="#0079d3">
					<Text fontSize="14px" fontWeight="500" color="#FFF">
						About Community
					</Text>
				</Box>
				<Box padding="0 12px">
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
					<Box padding="12px 0" borderBottom="1px" borderColor="gray.200">
						<Text fontSize="16px" fontWeight="600">
							{communityData.currentCommunity?.membersCount}
						</Text>
						<Text fontSize="12px" color="gray.500">
							Members
						</Text>
					</Box>
					<Link href={`/r/${communityId}/submit`}>
						<Button
							fontSize="14px"
							color="#FFF"
							fontWeight="700"
							height="32px"
							width="full"
							backgroundColor="#0079d3"
							_hover={{ backgroundColor: "#0079d3" }}
							borderRadius="2rem"
							margin="12px 0"
						>
							Create Post
						</Button>
					</Link>
				</Box>
			</Box>
		</Box>
	);
};

export default AboutCommunity;
