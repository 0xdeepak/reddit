"use client";

import { Post } from "@/atoms/postAtom";
import { firestore } from "@/firebase/clientApp";
import usePostsData from "@/hooks/usePostsData";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import NotFound from "./notFound";

// export const metadata = {
// 	title: "Post",
// 	description: "Detailed Post Page",
// };

export default function PostLayout({
	children,
	params: { postId },
}: {
	children: React.ReactNode;
	params: {
		postId: string;
	};
}) {
	const [isError, setIsError] = useState(false);
	const { postsData, setSelectedPost } = usePostsData();

	useEffect(() => {
		async function fetchPostData() {
			try {
				const postDocRef = doc(firestore, "posts", postId);
				const postDoc = await getDoc(postDocRef);
				if (postDoc.exists()) {
					setSelectedPost(postDoc.data() as Post);
				} else {
					setIsError(true);
				}
			} catch (error: any) {
				console.log("error while fetching post", error.message);
			}
		}
		if (!postsData.selectedPost || postsData.selectedPost.id !== postId) {
			fetchPostData();
		}
	}, [postId, postsData.selectedPost, setSelectedPost]);

	if (isError) {
		return <NotFound postId={postId}></NotFound>;
	}

	return <>{children}</>;
}
