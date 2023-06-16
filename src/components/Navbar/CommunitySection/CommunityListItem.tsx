import { Image, MenuItem, Text } from "@chakra-ui/react";
import Link from "next/link";
import { FunctionComponent } from "react";

interface CommunityListItemProps {
	communityName: string;
	logoUrl: string;
}

const CommunityListItem: FunctionComponent<CommunityListItemProps> = ({
	communityName,
	logoUrl,
}) => {
	return (
		<Link href={`/r/${communityName}`}>
			<MenuItem _hover={{ backgroundColor: "gray.100" }} padding="8px 24px">
				<Image
					src={logoUrl}
					alt={`${communityName} logo`}
					height="22px"
					width="22px"
					color="gray.600"
					marginRight="8px"
					borderRadius="50%"
					objectFit="cover"
					overflow="hidden"
				></Image>
				<Text fontSize="14px" fontWeight="400">
					{communityName}
				</Text>
			</MenuItem>
		</Link>
	);
};

export default CommunityListItem;
