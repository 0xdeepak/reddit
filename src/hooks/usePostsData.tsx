import { Post, PostAtom, UserVote } from "@/atoms/postAtom";
import { Comment } from "@/components/Posts/CommentsSection/Comment";
import { firestore, storage } from "@/firebase/clientApp";
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	increment,
	query,
	where,
	writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useCallback } from "react";
import { useRecoilState } from "recoil";

interface usePostsDataProps {}

const usePostsData = () => {
	const [postState, setPostState] = useRecoilState(PostAtom);

	const onChangePostVote = useCallback(
		async (
			postId: string,
			userId: string,
			prevValue: number,
			communityId: string,
			newValue: number
		) => {
			try {
				const batch = writeBatch(firestore);
				const updatedSelectedPost = { ...postState.selectedPost } as Post;
				const updatedPosts = [...postState.posts];
				let updatedUserVotes = [...postState.userVotes];

				// post doc from posts collection
				const postDocRef = doc(firestore, "posts", postId);

				// user is voting post for first time
				if (prevValue === 0) {
					// vote doc in userVotes subcollection in user document identified by post_id on which user voted
					const userVoteDocRef = doc(
						collection(firestore, `users/${userId}/userVotes`)
					);

					const newVote: UserVote = {
						id: userVoteDocRef.id,
						type: "post",
						parentId: postId,
						communityId: communityId,
						value: newValue,
					};
					// add this vote to userVotes collection of user
					batch.set(userVoteDocRef, newVote);
					updatedUserVotes.push(newVote);

					// update vote count in post
					batch.update(postDocRef, {
						voteCount: increment(newValue),
					});
					updatedPosts.forEach((el, index, array) => {
						if (el.id === postId) {
							array[index] = {
								...el,
								voteCount: el.voteCount + newValue,
							};
						}
					});
					if (updatedSelectedPost?.id === postId) {
						updatedSelectedPost.voteCount += newValue;
					}
				} else {
					const userVoteDocRef = (
						await getDocs(
							query(
								collection(firestore, `users/${userId}/userVotes`),
								where("parentId", "==", postId)
							)
						)
					).docs.at(0)?.ref!;

					// user removed vote from post
					if (prevValue === newValue) {
						// remove vote from userVotes of user
						batch.delete(userVoteDocRef);
						updatedUserVotes = updatedUserVotes.filter(
							(el) => el.parentId !== postId
						);

						// update vote count of post
						batch.update(postDocRef, {
							voteCount: increment(newValue * -1),
						});
						updatedPosts.forEach((el, index, array) => {
							if (el.id === postId) {
								array[index] = {
									...el,
									voteCount: el.voteCount + newValue * -1,
								};
							}
						});
						if (updatedSelectedPost?.id === postId) {
							updatedSelectedPost.voteCount += newValue * -1;
						}
					} else {
						// user changed vote from downvote to upvote or vice-versa
						// update value in userVote doc in user to new value
						batch.update(userVoteDocRef, {
							value: newValue,
						});
						updatedUserVotes.forEach((el, index, array) => {
							if (el.parentId === postId) {
								array[index] = {
									...el,
									value: newValue,
								};
							}
						});

						// update vote count of post
						batch.update(postDocRef, {
							voteCount: increment(newValue * 2),
						});
						updatedPosts.forEach((el, index, array) => {
							if (el.id === postId) {
								array[index] = {
									...el,
									voteCount: el.voteCount + newValue * 2,
								};
							}
						});
						if (updatedSelectedPost?.id === postId) {
							updatedSelectedPost.voteCount += newValue * 2;
						}
					}
				}
				await batch.commit();
				setPostState({
					selectedPost: updatedSelectedPost,
					posts: updatedPosts,
					userVotes: updatedUserVotes,
				});
				return true;
			} catch (error: any) {
				console.log(error.message);
				return false;
			}
		},
		[postState, setPostState]
	);

	const onChangeCommentVote = useCallback(
		async (
			commentId: string,
			userId: string,
			prevValue: number,
			communityId: string,
			newValue: number,
			comments: Comment[],
			setComments: (comments: Comment[]) => void
		) => {
			try {
				const batch = writeBatch(firestore);
				let updatedUserVotes = [...postState.userVotes];
				let updatedComments = [...comments];

				// post doc from posts collection
				const commentDocRef = doc(firestore, "comments", commentId);

				// user is voting post for first time
				if (prevValue === 0) {
					// vote doc in userVotes subcollection in user document identified by post_id on which user voted
					const userVoteDocRef = doc(
						collection(firestore, `users/${userId}/userVotes`)
					);

					const newVote: UserVote = {
						id: userVoteDocRef.id,
						type: "comment",
						parentId: commentId,
						communityId: communityId,
						value: newValue,
					};
					// add this vote to userVotes collection of user
					batch.set(userVoteDocRef, newVote);
					updatedUserVotes.push(newVote);

					// update vote count in post
					batch.update(commentDocRef, {
						voteCount: increment(newValue),
					});
					updatedComments.forEach((el, index, array) => {
						if (el.id === commentId) {
							array[index] = {
								...el,
								voteCount: el.voteCount + newValue,
							};
						}
					});
				} else {
					const userVoteDocRef = (
						await getDocs(
							query(
								collection(firestore, `users/${userId}/userVotes`),
								where("parentId", "==", commentId)
							)
						)
					).docs.at(0)?.ref!;

					// user removed vote from post
					if (prevValue === newValue) {
						// remove vote from userVotes of user
						batch.delete(userVoteDocRef);
						updatedUserVotes = updatedUserVotes.filter(
							(el) => el.parentId !== commentId
						);

						// update vote count of post
						batch.update(commentDocRef, {
							voteCount: increment(newValue * -1),
						});
						updatedComments.forEach((el, index, array) => {
							if (el.id === commentId) {
								array[index] = {
									...el,
									voteCount: el.voteCount + newValue * -1,
								};
							}
						});
					} else {
						// user changed vote from downvote to upvote or vice-versa
						// update value in userVote doc in user to new value
						batch.update(userVoteDocRef, {
							value: newValue,
						});
						updatedUserVotes.forEach((el, index, array) => {
							if (el.parentId === commentId) {
								array[index] = {
									...el,
									value: newValue,
								};
							}
						});

						// update vote count of post
						batch.update(commentDocRef, {
							voteCount: increment(newValue * 2),
						});
						updatedComments.forEach((el, index, array) => {
							if (el.id === commentId) {
								array[index] = {
									...el,
									voteCount: el.voteCount + newValue * 2,
								};
							}
						});
					}
				}
				await batch.commit();
				setPostState((prevVal) => ({
					...prevVal,
					userVotes: updatedUserVotes,
				}));
				setComments(updatedComments);
				return true;
			} catch (error: any) {
				console.log(error.message);
				return false;
			}
		},
		[postState, setPostState]
	);

	const onAddComment = async (newComment: Comment) => {
		try {
			const batch = writeBatch(firestore);

			// create comment doc
			const commentDocRef = doc(collection(firestore, "comments"));
			newComment.id = commentDocRef.id;
			batch.set(commentDocRef, newComment);

			// update commentsCount in post
			const postDocRef = doc(firestore, "posts", newComment.postId);
			batch.update(postDocRef, {
				commentsCount: increment(1),
			});
			await batch.commit();
			return true;
		} catch (error: any) {
			console.log(error.message);
			return false;
		}
	};

	const onDeleteComment = async (comment: Comment) => {
		try {
			const batch = writeBatch(firestore);

			// delete comment doc
			const commentDocRef = doc(firestore, "comments", comment.id);
			batch.delete(commentDocRef);

			// update commentsCount in post
			const postDocRef = doc(firestore, "posts", comment.postId);
			batch.update(postDocRef, {
				commentsCount: increment(-1),
			});
			await batch.commit();
			return true;
		} catch (error: any) {
			console.log(error.message);
			return false;
		}
	};

	const onSelectPost = (post: Post) => {
		setPostState((prevVal) => ({
			...prevVal,
			selectedPost: post,
		}));
	};

	const onDeletePost = useCallback(
		async (post: Post) => {
			try {
				// delete image from cloud storage if present in post
				if (post.imageUrl) {
					const imageRef = ref(storage, `posts/${post.id}/image`);
					await deleteObject(imageRef);
				}
				// delete post doc from firestore
				const postDocRef = doc(firestore, "posts", post.id);
				await deleteDoc(postDocRef);

				// update posts visible to user
				setPostState((prevVal) => ({
					...prevVal,
					posts: prevVal.posts.filter((val) => val.id !== post.id),
				}));
				return true;
			} catch (error: any) {
				return false;
			}
		},
		[setPostState]
	);

	const setPostsData = useCallback(
		(postsData: Post[]) => {
			setPostState((prevVal) => ({
				...prevVal,
				posts: postsData,
			}));
		},
		[setPostState]
	);

	const setuserVotesData = useCallback(
		(userVotes: UserVote[]) => {
			setPostState((prevVal) => ({
				...prevVal,
				userVotes: userVotes,
			}));
		},
		[setPostState]
	);

	const setSelectedPost = useCallback(
		(post: Post) => {
			setPostState((prevVal) => ({
				...prevVal,
				selectedPost: post,
			}));
		},
		[setPostState]
	);

	return {
		postsData: postState,
		onChangePostVote,
		onChangeCommentVote,
		onAddComment,
		onDeleteComment,
		onSelectPost,
		onDeletePost,
		setPostsData,
		setuserVotesData,
		setSelectedPost,
	};
};

export default usePostsData;
