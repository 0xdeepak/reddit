import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface Post {
	id: string;
	communityId: string;
	communityLogoUrl: string;
	communityType: string;
	creatorId: string;
	creatorUsername: string;
	title: string;
	body?: string;
	imageUrl?: string;
	commentsCount: number;
	voteCount: number;
	createdAt: Timestamp;
}

export interface UserVote {
	id: string;
	type: string;
	parentId: string;
	communityId: string;
	value: number;
}

export interface PostState {
	selectedPost: Post | null;
	posts: Post[];
	userVotes: UserVote[];
}

const defaultPostState: PostState = {
	selectedPost: null,
	posts: [],
	userVotes: [],
};

export const PostAtom = atom<PostState>({
	key: "postAtom",
	default: defaultPostState,
});
