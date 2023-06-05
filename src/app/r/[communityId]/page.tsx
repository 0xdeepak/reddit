"use client";

import { FunctionComponent, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { Community, communityAtom } from "@/atoms/communityAtom";
import { Button, ChakraProvider, Flex, Box, Text } from "@chakra-ui/react";
import { theme } from "@/chakra/theme";
import Link from "next/link";
import Error from "./error";
import Header from "./header";
import useCommunityData from "@/hooks/useCommunityData";
import { useRouter } from "next/navigation";
import AboutCommunity from "./aboutCommunity";

interface CommunityPageProps {
	params: { communityId: string };
}

const CommunityPage: FunctionComponent<CommunityPageProps> = ({
	params: { communityId },
}) => {
	const { communityData } = useCommunityData();

	return (
		<ChakraProvider theme={theme}>
			<Box flexGrow="1" backgroundColor="gray.200">
				<Header></Header>
				<Box backgroundColor="#FFF">
					<Flex
						maxWidth="984px"
						width="full"
						margin="auto"
						padding="0 16px 0 24px"
					>
						<Link
							href={`/r/${communityId}`}
							style={{
								fontSize: "14px",
								fontWeight: "500",
								padding: "2px 8px",
								borderBottom: "3px solid #0079d3",
								marginRight: "8px",
							}}
						>
							Posts
						</Link>
					</Flex>
				</Box>
				<Flex
					maxWidth="984px"
					width="full"
					margin="auto"
					padding="20px 16px 0 24px"
				>
					<Box flexGrow="1"></Box>
					<AboutCommunity
						communityData={communityData}
						communityId={communityId}
					></AboutCommunity>
				</Flex>
			</Box>
		</ChakraProvider>
	);
};

export default CommunityPage;
