import { atom } from "recoil";

export interface userState {
	user: any | null;
}

const defaultUserState: userState = {
	user: null,
};

export const userAtom = atom<userState>({
	key: "userState",
	default: defaultUserState,
});
