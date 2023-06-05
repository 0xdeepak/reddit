"use client";

import { Community } from "@/atoms/communityAtom";
import { firestore } from "@/firebase/clientApp";
import useCommunityData from "@/hooks/useCommunityData";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Error from "./error";

export const metadata = {
	title: "Community",
	description: "Community Homepage",
};

export default function CommunityLayout({
	children,
	params: { communityId },
}: {
	children: React.ReactNode;
	params: { communityId: string };
}) {
	const { setCurrentCommunity } = useCommunityData();
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		async function fetchCommunityData() {
			try {
				const communityDocRef = doc(
					firestore,
					"communities",
					communityId.toLowerCase()
				);
				const communityDoc = await getDoc(communityDocRef);
				if (communityDoc.exists()) {
					setCurrentCommunity(communityDoc.data() as Community);
				} else {
					setIsError(true);
				}
			} catch (error) {
				console.log("error while fetching communities", error);
			}
		}
		fetchCommunityData();
	}, []);

	if (isError) {
		return <Error></Error>;
	}
	return (
		<>
			<div style={{ height: "48px" }}></div>
			{children}
		</>
	);
}
