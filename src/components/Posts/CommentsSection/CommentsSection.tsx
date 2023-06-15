import { Box, Flex, Text } from "@chakra-ui/react";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { userState } from "@/atoms/userAtom";
import {
	Timestamp,
	collection,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	where,
} from "firebase/firestore";
import { Post, UserVote } from "@/atoms/postAtom";
import NewCommment from "./NewComment";
import CommentItem, { Comment } from "./Comment";
import { firestore } from "@/firebase/clientApp";
import SkeletonLoader from "./Loader";
import ErrorBox from "./Error";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";

interface CommentsSectionProps {
	currentUser: userState;
	userRole: string;
	postData: Post;
	userVotesData: UserVote[];
	setPostData: (post: Post) => void;
	onAddComment: (value: Comment) => Promise<boolean>;
	onDeleteComment: (value: Comment) => Promise<boolean>;
	onChangeCommentVote: (
		commentId: string,
		userId: string,
		prevValue: number,
		communityId: string,
		newValue: number,
		comments: Comment[],
		setComments: (comments: Comment[]) => void
	) => Promise<boolean>;
	communityName: string;
}

const CommentsSection: FunctionComponent<CommentsSectionProps> = ({
	currentUser,
	userRole,
	postData,
	userVotesData,
	setPostData,
	communityName,
	onAddComment,
	onDeleteComment,
	onChangeCommentVote,
}) => {
	const openAuthModal = useSetRecoilState(authModalState);
	const [comments, setComments] = useState<Comment[]>([]);
	const [fetchingData, setFetchingData] = useState(false);
	const [error, setError] = useState(false);

	const handleCreateNewComment = async (value: string) => {
		try {
			const comment: Comment = {
				id: "",
				creatorId: currentUser.user.uid,
				creatorUsername: currentUser.user.displayName,
				communityId: communityName.toLowerCase(),
				postId: postData.id,
				postTitle: postData.title,
				createdAt: serverTimestamp() as Timestamp,
				text: value,
				voteCount: 0,
			};
			// create comment in firestore
			const res = await onAddComment(comment);
			if (!res) {
				throw Error("onAddComment error");
			}

			// update client state
			comment.createdAt = Timestamp.now();
			setComments((prevVal) => [comment, ...prevVal]);
			setPostData({
				...postData,
				commentsCount: postData.commentsCount + 1,
			} as Post);
		} catch (error: any) {
			console.log(error.message);
		}
	};

	const handleDeleteComment = async (comment: Comment) => {
		try {
			// delete comment in firestore
			const res = await onDeleteComment(comment);
			if (!res) {
				throw Error("onAddComment error");
			}

			// update client state
			setComments((prevVal) => prevVal.filter((el) => el.id !== comment.id));
			setPostData({
				...postData,
				commentsCount: postData.commentsCount - 1,
			} as Post);
		} catch (error: any) {
			console.log(error.message);
		}
	};

	const fetchComments = useCallback(async () => {
		setError(false);
		setFetchingData(true);
		try {
			const commentsQuery = query(
				collection(firestore, "comments"),
				where("postId", "==", postData.id),
				orderBy("createdAt", "desc")
			);
			const commentsDocs = await getDocs(commentsQuery);
			const comments = commentsDocs.docs.map((doc) => doc.data() as Comment);
			setComments(comments);
		} catch (error: any) {
			console.log("comments fetching error", error);
			setError(true);
		} finally {
			setFetchingData(false);
		}
	}, [postData.id]);

	const changeCommentVote = async (
		comment: Comment,
		prevValue: number,
		newValue: number
	) => {
		if (!currentUser.user) {
			openAuthModal((prev) => ({
				...prev,
				view: "login",
				open: true,
			}));
			return;
		}
		await onChangeCommentVote(
			comment.id,
			currentUser.user.uid,
			prevValue,
			communityName.toLowerCase(),
			newValue,
			comments,
			(updatedComments) => {
				setComments(updatedComments);
			}
		);
	};

	useEffect(() => {
		fetchComments();
	}, [fetchComments]);

	if (error) {
		return (
			<Box>
				<NewCommment
					onCreateComment={handleCreateNewComment}
					username={currentUser.user?.displayName || null}
				/>
				<ErrorBox retry={fetchComments} />
			</Box>
		);
	}

	return (
		<Box>
			<NewCommment
				onCreateComment={handleCreateNewComment}
				username={currentUser.user?.displayName || null}
			/>
			{fetchingData ? (
				<SkeletonLoader count={2} />
			) : comments.length === 0 ? (
				<Flex height="250px" justifyContent="center" alignItems="center">
					<Text fontSize="14px" color="gray.500">
						No Comments Yet
					</Text>
				</Flex>
			) : (
				<Box padding="40px 48px 16px" minHeight="250px">
					{comments.map((comment, index) => (
						<CommentItem
							key={comment.id}
							data={comment}
							currentUserId={currentUser.user?.uid || ""}
							isAdmin={userRole === "admin"}
							isOp={comment.creatorId === postData.creatorId}
							userVote={
								userVotesData.find(
									(userVote) =>
										userVote.type === "comment" &&
										userVote.parentId === comment.id
								)?.value || 0
							}
							onDeleteComment={handleDeleteComment}
							changeCommentVote={changeCommentVote}
						/>
					))}
				</Box>
			)}
		</Box>
	);
};

export default CommentsSection;
