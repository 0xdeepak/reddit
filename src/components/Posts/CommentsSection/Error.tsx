import {
	Alert,
	AlertDescription,
	Box,
	Button,
	Flex,
	Icon,
	Text,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { MdRefresh } from "react-icons/md";

interface ErrorProps {
	retry: () => Promise<void>;
}

const Error: FunctionComponent<ErrorProps> = ({ retry }) => {
	return (
		<Flex
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			textAlign="center"
			height="200px"
		>
			<Text fontSize="14px" color="red.500	">
				An error occured while fetching comments.
			</Text>
			<Button
				borderRadius="2rem"
				padding="0 16px"
				backgroundColor="#fff"
				color="#e53e3e"
				// border="2px solid #e53e3e"
				width="auto"
				height="30px"
				marginTop="12px"
				onClick={() => retry()}
			>
				<Icon
					as={MdRefresh}
					height="22px"
					width="22px"
					marginRight="8px"
				></Icon>
				Retry
			</Button>
		</Flex>
	);
};

export default Error;
