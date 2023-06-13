import { Box, Skeleton, SkeletonText } from "@chakra-ui/react";
import { FunctionComponent } from "react";

interface SkeletonLoaderProps {
	count: number;
}

const SkeletonLoader: FunctionComponent<SkeletonLoaderProps> = ({ count }) => {
	return (
		<>
			{Array<boolean>(count)
				.fill(true)
				.map((e, index) => (
					<Box
						key={index}
						borderRadius="6px"
						backgroundColor="#fff"
						padding="16px"
						width="full"
						marginBottom="20px"
					>
						<SkeletonText
							noOfLines={1}
							width="40%"
							skeletonHeight={4}
							marginBottom="16px"
						/>
						<SkeletonText
							noOfLines={2}
							spacing={3}
							skeletonHeight={5}
							marginBottom="24px"
						/>
						<Skeleton key={index} height="350px" width="full" />
					</Box>
				))}
		</>
	);
};

export default SkeletonLoader;
