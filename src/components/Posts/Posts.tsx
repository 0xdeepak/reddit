import { FunctionComponent, useCallback, useEffect, useState } from "react";
import {
	Alert,
	AlertDescription,
	AlertIcon,
	Box,
	Button,
	Icon,
	Skeleton,
	SkeletonText,
	useFocusEffect,
} from "@chakra-ui/react";
import { IoIosRefreshCircle } from "react-icons/io";
import { communityState } from "@/atoms/communityAtom";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import Error from "./Error";
import usePostsData from "@/hooks/usePostsData";
import Post from "./Post";
import { userState } from "@/atoms/userAtom";
import SkeletonLoader from "./Loader";
import { UserVote } from "@/atoms/postAtom";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import Router from "next/router";
import { useRouter } from "next/navigation";

interface PostsProps {
	communityData: communityState;
	currentUser: userState;
	userRole: string;
}

const Posts: FunctionComponent<PostsProps> = ({
	communityData,
	currentUser,
	userRole,
}) => {
	const setAuthModalState = useSetRecoilState(authModalState);
	const [postsDataFetching, setPostsDataFetching] = useState(true);
	const [dataFetchingError, setDataFetchingError] = useState(false);
	const {
		postsData,
		setPostsData,
		setuserVotesData,
		onChangeVote,
		onSelectPost,
		onDeletePost,
	} = usePostsData();
	const router = useRouter();

	// fetch posts on initial render
	const fetchPostsData = useCallback(async () => {
		if (!communityData.currentCommunity?.name) {
			return;
		}
		setPostsDataFetching(true);
		try {
			const postsQuery = query(
				collection(firestore, "posts"),
				where("communityId", "==", communityData.currentCommunity?.name),
				orderBy("createdAt", "desc")
			);
			const postDocs = await getDocs(postsQuery);
			const posts = postDocs.docs.map((doc) => doc.data() as Post);
			setPostsData(posts);
		} catch (error: any) {
			setDataFetchingError(true);
		} finally {
			setPostsDataFetching(false);
		}
	}, [communityData.currentCommunity?.name, setPostsData]);

	useEffect(() => {
		fetchPostsData();
	}, [fetchPostsData]);

	useEffect(() => {
		if (currentUser.user) {
			const fetchuserVotes = async () => {
				const userVotesRef = collection(
					firestore,
					`users/${currentUser.user.uid}/userVotes`
				);
				const snapshot = await getDocs(userVotesRef);
				const userVotes = snapshot.docs.map((doc) => doc.data() as UserVote);
				setuserVotesData(userVotes);
			};
			fetchuserVotes();
		} else {
			setuserVotesData([]);
		}
	}, [currentUser.user, setuserVotesData]);

	const handleSelectPost = (post: Post) => {
		onSelectPost(post);
		router.push(
			`/r/${communityData.currentCommunity?.name}/comments/${post.id}`
		);
	};

	if (dataFetchingError) {
		return <Error retry={fetchPostsData} />;
	}

	return (
		<Box flexGrow="1">
			{postsDataFetching && <SkeletonLoader count={2} />}
			{postsData.posts.map((post, index) => {
				return (
					<Post
						key={post.id}
						postData={post}
						userId={currentUser.user?.uid || ""}
						communityName={communityData.currentCommunity!.name}
						isUserCreatorOrAdmin={
							currentUser.user &&
							((userRole === "member" &&
								post.creatorId === currentUser.user.uid) ||
								userRole === "admin")
						}
						userVote={
							postsData.userVotes.find(
								(userVote) => userVote.parentId === post.id
							)?.value || 0
						}
						onChangeVote={onChangeVote}
						onSelectPost={handleSelectPost}
						onDeletePost={onDeletePost}
						openAuthModal={() =>
							setAuthModalState((prevVal) => ({
								...prevVal,
								open: true,
								view: "login",
							}))
						}
					/>
				);
			})}
		</Box>
	);
};

export default Posts;
