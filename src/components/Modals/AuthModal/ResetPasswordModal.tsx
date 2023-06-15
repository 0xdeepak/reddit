import { FunctionComponent, useEffect, useState } from "react";
import {
	Modal,
	ModalContent,
	ModalOverlay,
	ModalCloseButton,
	ModalBody,
	Heading,
	Text,
	Button,
	Flex,
	Input,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";

interface ResetPasswordModalProps {}

const ResetPasswordModal: FunctionComponent<ResetPasswordModalProps> = () => {
	const [userInput, setUserInput] = useState({ username: "", email: "" });
	const [modalState, setModalState] = useRecoilState(authModalState);
	const [emailSent, setEmailSent] = useState(false);
	const [sendPasswordResetEmail, sending, passwordResetError] =
		useSendPasswordResetEmail(auth);

	useEffect(() => {
		setUserInput({
			username: "",
			email: "",
		});
		setEmailSent(false);
	}, [modalState]);

	const handleClose = () => {
		setModalState((prevState) => ({
			...prevState,
			open: false,
		}));
	};

	const goToSignup = () => {
		setModalState((prevState) => ({
			...prevState,
			view: "signup",
		}));
	};

	const goToLogin = () => {
		setModalState((prevState) => ({
			...prevState,
			view: "login",
		}));
	};

	const goToForgotUsername = () => {
		setModalState((prevState) => ({
			...prevState,
			view: "forgotUsername",
		}));
	};

	const handleUsernameChange = (event: { target: { value: any } }) => {
		setUserInput((prevState) => ({
			...prevState,
			username: event.target.value,
		}));
	};

	const handleEmailChange = (event: { target: { value: any } }) => {
		setUserInput((prevState) => ({
			...prevState,
			email: event.target.value,
		}));
	};

	const handleResetPassword = () => {
		sendPasswordResetEmail(userInput.email, {
			url: `${process.env.REACT_SERVER_URL}resetpassword/`,
		}).then((res) => {
			setEmailSent(true);
		});
	};

	const isFormValid = () => {
		const res = userInput["username"] != "" && userInput["email"] != "";
		const regEx =
			/(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
		return res && regEx.test(userInput["email"]);
	};

	return (
		<>
			<Modal
				isOpen={modalState.open && modalState.view === "resetPassword"}
				onClose={handleClose}
				isCentered
			>
				<ModalOverlay
					bg="blackAlpha.300"
					backdropFilter="auto"
					backdropBlur="5px"
				/>
				<ModalContent
					width="auto"
					borderRadius="12px"
					maxWidth="600px"
					height="min(640px, calc(100vh - 84px))"
					overflowY="auto"
					overflowX="hidden"
					marginTop="60px"
					marginBottom="18px"
				>
					<Flex
						direction="column"
						width="400px"
						minHeight="640px"
						padding={`130px 60px ${emailSent ? "50px" : "100px"}  60px`}
					>
						<ModalCloseButton
							color="#878a8c"
							_hover={{ backgroundColor: "#FFFF" }}
						/>
						<ModalBody padding="0 0">
							<Flex
								flexDirection="column"
								justifyContent="space-between"
								height="full"
							>
								<div>
									<Heading as="h1" fontSize="20px" fontWeight="500">
										Reset your password
									</Heading>
									<Text fontSize="12px" marginTop="8px">
										Tell us the username and email address associated with your
										Reddit account, and we’ll send you an email with a link to
										reset your password.
									</Text>
								</div>
								<div>
									<Input
										placeholder="Username"
										value={userInput["username"]}
										_placeholder={{
											fontSize: "14px",
											fontWeight: "500",
											color: "#787c7e",
										}}
										padding="15px"
										fontSize="14px"
										borderRadius="2rem"
										border="0px"
										backgroundColor="#f6f7f8"
										_hover={{ border: "1px solid #00000033" }}
										_focusVisible={{ border: "1px solid #00000033" }}
										onChange={handleUsernameChange}
									></Input>
									<Input
										placeholder="Email"
										value={userInput["email"]}
										_placeholder={{
											fontSize: "14px",
											fontWeight: "500",
											color: "#787c7e",
										}}
										padding="15px"
										fontSize="14px"
										borderRadius="2rem"
										border="0px"
										backgroundColor="#f6f7f8"
										_hover={{ border: "1px solid #00000033" }}
										_focusVisible={{ border: "1px solid #00000033" }}
										marginTop="16px"
										onChange={handleEmailChange}
									></Input>
									{passwordResetError && (
										<Text fontSize="12px" color="red.400" marginTop="12px">
											{/* {passwordResetError?.message} */}
											An error occurred. Please try again later.
										</Text>
									)}
								</div>
								{/* <Text fontSize="12px">
								Forgot your{" "}
								<Text
									color="#0079d3"
									fontWeight="700"
									as="u"
									onClick={goToForgotUsername}
									cursor="pointer"
								>
									username
								</Text>
								?
							</Text> */}
								<Button
									fontSize="14px"
									fontWeight="700"
									backgroundColor="#FF4500"
									color="#FFFF"
									borderRadius="2rem"
									height="40px"
									_hover={{ backgroundColor: "#FF4500" }}
									isDisabled={emailSent || !isFormValid()}
									_disabled={{ backgroundColor: "#F7D8CC" }}
									isLoading={sending}
									onClick={handleResetPassword}
								>
									{emailSent && !passwordResetError ? (
										<img
											src="https://www.redditstatic.com/accountmanager/c627c150c56e1f08595ec45afe9b43b1.svg"
											alt="check icon"
										/>
									) : (
										"Reset Password"
									)}
								</Button>
								{emailSent && !passwordResetError && (
									<Text fontSize="12px" color="#0079d3">
										{
											"Thanks! If there are any Reddit accounts associated with that email address, you'll get an email with your username(s) shortly."
										}
									</Text>
								)}
								<Text fontSize="12px">
									{"Dont have an email or need assistance logging in? Get Help"}
								</Text>
								<Text fontSize="12px">
									<Text
										color="#0079d3"
										fontWeight="700"
										as="u"
										onClick={goToSignup}
										cursor="pointer"
									>
										Sign Up
									</Text>{" "}
									&#183;{" "}
									<Text
										color="#0079d3"
										fontWeight="700"
										as="u"
										onClick={goToLogin}
										cursor="pointer"
									>
										Log In
									</Text>
								</Text>
							</Flex>
						</ModalBody>
					</Flex>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ResetPasswordModal;
