import { communityState } from "@/atoms/communityAtom";
import { Box, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";

interface AboutCommunityProps {
	communityData: communityState;
}

const AboutCommunity: FunctionComponent<AboutCommunityProps> = ({
	communityData,
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
					<Text fontSize="18px" paddingTop="12px">
						{communityData.currentCommunity?.name}
					</Text>
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
				</Box>
			</Box>
		</Box>
	);
};

export default AboutCommunity;
