import { FunctionComponent } from "react";
import LoginModal from "./LoginModal";
import ResetPasswordModal from "./ResetPasswordModal";
import SignupModal from "./SignupModal";
import CreateProfileModal from "./CreateProfileModal";

interface AuthModalProps {}

const AuthModal: FunctionComponent<AuthModalProps> = () => {
	return (
		<>
			<LoginModal></LoginModal>
			<SignupModal></SignupModal>
			<ResetPasswordModal></ResetPasswordModal>
			<CreateProfileModal></CreateProfileModal>
		</>
	);
};

export default AuthModal;
