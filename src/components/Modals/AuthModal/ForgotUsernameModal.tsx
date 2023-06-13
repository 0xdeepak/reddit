import React, { FunctionComponent, useState } from "react";
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
	Box,
	Input,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";

interface ForgotUsernameModalProps {}

const ForgotUsernameModal: FunctionComponent<ForgotUsernameModalProps> = () => {
	const [modalState, setModalState] = useRecoilState(authModalState);
	const [email, setEmail] = useState("");
	const [emailSent, setEmailSent] = useState(false);

	const handleClose = () => {
		setModalState((prevState) => ({
			...prevState,
			open: false,
		}));
	};

	const goToLogIn = () => {
		setModalState((prevState) => ({
			...prevState,
			view: "login",
		}));
	};

	const goToSignup = () => {
		setModalState((prevState) => ({
			...prevState,
			view: "signup",
		}));
	};

	const handleEmailChange = (event: {
		target: { value: React.SetStateAction<string> };
	}) => {
		setEmail(event.target.value);
	};

	const handleSendEmail = () => {
		setEmailSent(true);
	};

	const isEmailValid = () => {
		const regEx =
			/(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
		return email != "" && regEx.test(email);
	};

	return (
		<>
			<Modal
				isOpen={modalState.open && modalState.view === "forgotUsername"}
				onClose={handleClose}
				isCentered
			>
				<ModalOverlay
					bg="blackAlpha.300"
					backdropFilter="auto"
					backdropBlur="5px"
				/>
				<ModalContent
					width="400px"
					height="640px"
					borderRadius="12px"
					padding={`185px 60px ${emailSent ? "80px" : "160px"} 60px`}
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
									Recover your username
								</Heading>
								<Text fontSize="12px" marginTop="8px">
									Tell us the email address associated with your Reddit account,
									and we’ll send you an email with your username.
								</Text>
							</div>
							<Input
								placeholder="Email"
								value={email}
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
								onChange={handleEmailChange}
							></Input>
							<Button
								fontSize="14px"
								fontWeight="700"
								backgroundColor="#FF4500"
								color="#FFFF"
								borderRadius="2rem"
								height="40px"
								_hover={{ backgroundColor: "#FF4500" }}
								isDisabled={emailSent || !isEmailValid()}
								_disabled={{ backgroundColor: "#F7D8CC" }}
								onClick={handleSendEmail}
							>
								{emailSent ? (
									<img
										src="https://www.redditstatic.com/accountmanager/c627c150c56e1f08595ec45afe9b43b1.svg"
										alt="check icon"
									/>
								) : (
									"Email Me"
								)}
							</Button>
							{emailSent && (
								<Text fontSize="12px" color="#0079d3">
									{
										"Thanks! If there are any Reddit accounts associated with that email address, you'll get an email with your username(s) shortly."
									}
								</Text>
							)}
							<Text fontSize="12px">
								{"Don't have an email or need assistance logging in? Get Help"}
							</Text>
							<Text fontSize="12px">
								<Text
									color="#0079d3"
									fontWeight="700"
									as="u"
									onClick={goToSignup}
									cursor="pointer"
								>
									Sign Up{" "}
								</Text>
								&#183;
								<Text
									color="#0079d3"
									fontWeight="700"
									as="u"
									onClick={goToLogIn}
									cursor="pointer"
								>
									{" "}
									Log In
								</Text>
							</Text>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ForgotUsernameModal;
