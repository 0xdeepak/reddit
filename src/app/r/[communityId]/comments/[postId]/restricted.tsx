"use client";

import { Button, Flex, Text, Link } from "@chakra-ui/react";
import Error from "next/error";
import { FunctionComponent, useEffect } from "react";

interface RestrictedProps {
	error?: Error;
	reset?: () => void;
	isUserNoSignedIn?: boolean;
	isCommunityNotJoined?: boolean;
	communityId: string;
}

const Restricted: FunctionComponent<RestrictedProps> = ({ communityId }) => {
	return (
		<Flex
			justifyContent="center"
			alignItems="center"
			flexGrow="1"
			direction="column"
			height="150vh"
			backgroundColor="gray.200"
		>
			<Text
				fontSize="14px"
				fontWeight="500"
				textAlign="center"
				color="gray.600"
			>
				{`r/${communityId} is private.`}
				<br />
				Join to view / post in the community.
			</Text>
			<Link href={`/r/${communityId}`}>
				<Button
					marginTop="16px"
					borderRadius="2rem"
					padding="0 16px"
					backgroundColor="blue.400"
					_hover={{ backgroundColor: "blue.400" }}
					width="auto"
					color="#FFF"
				>
					{`Go to r/${communityId}`}
				</Button>
			</Link>
		</Flex>
	);
};

export default Restricted;
