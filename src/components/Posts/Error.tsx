import { Alert, AlertDescription, Box, Button, Icon } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { MdRefresh } from "react-icons/md";

interface ErrorProps {
	retry: () => void;
}

const Error: FunctionComponent<ErrorProps> = ({ retry }) => {
	return (
		<Box flexGrow="1">
			<Alert
				status="error"
				variant="subtle"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				textAlign="center"
				height="200px"
				borderRadius="6px"
			>
				<AlertDescription mb={4}>
					An error occured while fetching posts.
				</AlertDescription>
				<Button
					borderRadius="2rem"
					padding="0 16px"
					backgroundColor="inherit"
					color="#e53e3e"
					border="2px solid #e53e3e"
					width="120px"
					onClick={() => retry()}
				>
					<Icon
						as={MdRefresh}
						height="24px"
						width="24px"
						marginRight="8px"
					></Icon>
					Retry
				</Button>
			</Alert>
		</Box>
	);
};

export default Error;
