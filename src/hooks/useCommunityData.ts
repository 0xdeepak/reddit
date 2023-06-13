import {
	Community,
	communityAtom,
	communitySnippet,
	communityState,
} from "@/atoms/communityAtom";
import { userAtom } from "@/atoms/userAtom";
import { firestore, storage } from "@/firebase/clientApp";
import {
	DocumentData,
	QuerySnapshot,
	collection,
	doc,
	getDocs,
	increment,
	updateDoc,
	writeBatch,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

const useCommunityData = () => {
	const [communityState, setCommunityState] = useRecoilState(communityAtom);
	const currentUser = useRecoilValue(userAtom);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// fetch user communities
	const fetchMyComSnippets = useCallback(async () => {
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
	const setCurrentCommunity = useCallback(
		(communityData: Community) => {
			setCommunityState(
				(prevVal) =>
					({
						...prevVal,
						currentCommunity: communityData,
					} as communityState)
			);
		},
		[setCommunityState]
	);

	// join community
	const joinCommunity = useCallback(
		async (communityData: Community) => {
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
				// update members count in global state
				setCommunityState((prev) => ({
					...prev,
					currentCommunity: {
						...prev.currentCommunity,
						membersCount: prev.currentCommunity!.membersCount + 1,
					} as Community,
				}));
			} catch (error: any) {
				console.log(error);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		},
		[currentUser.user, fetchMyComSnippets, setCommunityState]
	);

	// leave community
	const leaveCommunity = useCallback(async () => {
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
			// update members count in global state
			setCommunityState((prev) => ({
				...prev,
				currentCommunity: {
					...prev.currentCommunity,
					membersCount: prev.currentCommunity!.membersCount - 1,
				} as Community,
			}));
		} catch (error: any) {
			console.log(error);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	}, [
		communityState.currentCommunity,
		currentUser.user,
		fetchMyComSnippets,
		setCommunityState,
	]);

	const onJoinOrLeaveCommunity = useCallback(
		(communityData?: Community | null) => {
			if (communityData) {
				joinCommunity(communityData);
				return;
			}
			leaveCommunity();
		},
		[joinCommunity, leaveCommunity]
	);

	// change logo of community
	const changeCommunityLogo = useCallback(
		async (file: string, communityId: string) => {
			try {
				// upload logo to cloud storage
				const imageRef = ref(
					storage,
					`communities/${communityId.toLowerCase()}/logo`
				);
				await uploadString(imageRef, file, "data_url");
				// get public download url for logo
				const downloadUrl = await getDownloadURL(imageRef);
				// update logoUrl in community doc in firestore
				await updateDoc(
					doc(firestore, "communities", communityId.toLowerCase()),
					{
						logoUrl: downloadUrl,
					}
				);
				// update community in global state
				setCommunityState((prevVal) => ({
					...prevVal,
					currentCommunity: {
						...prevVal.currentCommunity,
						logoUrl: downloadUrl,
					} as Community,
				}));
				return true;
			} catch (error: any) {
				console.log(error.message);
				return false;
			}
		},
		[setCommunityState]
	);

	// change banner image of community
	const changeCommunityBanner = useCallback(
		async (file: string, communityId: string) => {
			try {
				// upload logo to cloud storage
				const imageRef = ref(
					storage,
					`communities/${communityId.toLowerCase()}/banner`
				);
				await uploadString(imageRef, file, "data_url");
				// get public download url for logo
				const downloadUrl = await getDownloadURL(imageRef);
				// update logoUrl in community doc in firestore
				await updateDoc(
					doc(firestore, "communities", communityId.toLowerCase()),
					{
						bannerUrl: downloadUrl,
					}
				);
				// update community in global state
				setCommunityState((prevVal) => ({
					...prevVal,
					currentCommunity: {
						...prevVal.currentCommunity,
						bannerUrl: downloadUrl,
					} as Community,
				}));
				return true;
			} catch (error: any) {
				console.log(error.message);
				return false;
			}
		},
		[setCommunityState]
	);

	return {
		communityData: communityState,
		setCurrentCommunity,
		onJoinOrLeaveCommunity,
		changeCommunityLogo,
		changeCommunityBanner,
		loading,
	};
};

export default useCommunityData;
