import SignUpComponent from "../components/signup";
import Home from "./index";
import Container from "@material-ui/core/Container";

export default function SignUp() {
	return (
		<Home>
			<Container maxWidth="md" disableGutters={false}>
				<SignUpComponent />
			</Container>
		</Home>
	);
}
