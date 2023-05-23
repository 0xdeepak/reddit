import { atom } from "recoil";

export interface AuthModalState {
  open: boolean,
  view: 'login' | 'signup' | 'resetPassword' | 'forgotUsername' | 'createProfile'
  user: {
    email: string,
    username: string,
    password: string
  }
}

const defaultAuthModalState: AuthModalState = {
  open: false,
  view: 'login',
  user: {
    email: "",
    username: "",
    password: ""
  }
}

export const authModalState = atom<AuthModalState>({
  key: "authModalState",
  default: defaultAuthModalState
});