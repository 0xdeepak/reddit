import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface communityState {
	myCommunitySnippets: communitySnippet[];
	currentCommunity: Community | null;
}

export interface Community {
	name: string;
	creatorId: string;
	createdAt: Timestamp;
	membersCount: number;
	communityType: "public" | "restricted" | "private";
	isNsfw: boolean;
	logoUrl?: string;
	bannerImage?: string;
	about?: string;
}

export interface communitySnippet {
	communityName: string;
	isModerator: boolean;
	logoUrl: string;
}

const defaultcommunityState: communityState = {
	currentCommunity: null,
	myCommunitySnippets: [],
};

export const communityAtom = atom<communityState>({
	key: "communityState",
	default: defaultcommunityState,
});
