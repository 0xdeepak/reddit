import {
	Box,
	Flex,
	Skeleton,
	SkeletonCircle,
	SkeletonText,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";

interface SkeletonLoaderProps {
	count: number;
}

const SkeletonLoader: FunctionComponent<SkeletonLoaderProps> = ({ count }) => {
	return (
		<Box padding="24px 48px">
			{Array<boolean>(count)
				.fill(true)
				.map((e, index) => (
					<Box
						key={index}
						backgroundColor="#fff"
						width="full"
						marginBottom="24px"
					>
						<Flex marginBottom="16px" alignItems="center">
							<SkeletonCircle size="7" />
							<SkeletonText
								noOfLines={1}
								width="20%"
								skeletonHeight={4}
								marginLeft="16px"
							/>
						</Flex>
						<SkeletonText noOfLines={2} spacing={3} skeletonHeight={4} />
					</Box>
				))}
		</Box>
	);
};

export default SkeletonLoader;
