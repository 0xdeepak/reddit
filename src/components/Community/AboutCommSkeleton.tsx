import { Box, SkeletonText } from "@chakra-ui/react";
import { FunctionComponent } from "react";

interface AboutCommSkeletonProps {}

const AboutCommSkeleton: FunctionComponent<AboutCommSkeletonProps> = () => {
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
};

export default AboutCommSkeleton;
