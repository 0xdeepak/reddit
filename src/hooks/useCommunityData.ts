import {
	Community,
	communityAtom,
	communitySnippet,
	communityState,
} from "@/atoms/communityAtom";
import { userAtom } from "@/atoms/userAtom";
import { firestore } from "@/firebase/clientApp";
import {
	DocumentData,
	QuerySnapshot,
	collection,
	doc,
	getDocs,
	increment,
	writeBatch,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

const useCommunityData = () => {
	const [communityState, setCommunityState] = useRecoilState(communityAtom);
	const currentUser = useRecoilValue(userAtom);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// fetch user communities
	const fetchMyComSnippets = useCallback(async () => {
		setLoading(true);
		try {
			const communitySnippetRef = collection(
				firestore,
				`users/${currentUser.user?.uid}/communitySnippets`
			);
			const res: QuerySnapshot<DocumentData> = await getDocs(
				communitySnippetRef
			);
			const communities = res.docs.map((el) => el.data() as communitySnippet);
			setCommunityState((prevVal) => ({
				...prevVal,
				myCommunitySnippets: communities,
			}));
		} catch (error: any) {
			console.log("error while fetching communitySnippets", error);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	}, [currentUser.user, setCommunityState]);

	useEffect(() => {
		if (currentUser.user) {
			fetchMyComSnippets();
		} else {
			setCommunityState((prevVal) => ({
				...prevVal,
				myCommunitySnippets: [],
			}));
		}
	}, [currentUser, fetchMyComSnippets, setCommunityState]);

	// set current visible community
	const setCurrentCommunity = (communityData: Community) => {
		setCommunityState(
			(prevVal) =>
				({
					...prevVal,
					currentCommunity: communityData,
				} as communityState)
		);
	};

	const onJoinOrLeaveCommunity = (communityData?: Community | null) => {
		if (communityData) {
			joinCommunity(communityData);
			return;
		}
		leaveCommunity();
	};

	// join community
	const joinCommunity = async (communityData: Community) => {
		setLoading(true);

		// create community snippet for user
		try {
			const newComSnippet: communitySnippet = {
				communityName: communityData.name,
				isModerator: false,
				logoUrl: communityData.logoUrl || "",
			};

			const batch = writeBatch(firestore);
			batch.set(
				doc(
					firestore,
					`users/${currentUser.user.uid}/communitySnippets`,
					communityData.name.toLowerCase()
				),
				newComSnippet
			);
			// update noOfMembers of community
			batch.update(
				doc(firestore, "communities", communityData.name.toLowerCase()),
				{
					membersCount: increment(1),
				}
			);
			await batch.commit();
			// fetch new communitySnippets
			await fetchMyComSnippets();
		} catch (error: any) {
			console.log(error);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const leaveCommunity = async () => {
		setLoading(true);

		// delete community snippet for user
		try {
			const batch = writeBatch(firestore);
			batch.delete(
				doc(
					firestore,
					`users/${currentUser.user.uid}/communitySnippets`,
					communityState.currentCommunity!.name.toLowerCase()
				)
			);
			// update noOfMembers of community
			batch.update(
				doc(
					firestore,
					"communities",
					communityState.currentCommunity!.name.toLowerCase()
				),
				{
					membersCount: increment(-1),
				}
			);
			await batch.commit();
			// fetch new communitySnippets
			await fetchMyComSnippets();
		} catch (error: any) {
			console.log(error);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	// leave community
	return {
		communityData: communityState,
		setCurrentCommunity,
		onJoinOrLeaveCommunity,
		loading,
	};
};

export default useCommunityData;
