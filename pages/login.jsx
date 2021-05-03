import LoginComponent from "../components/login";
import Home from "./index";
import Container from "@material-ui/core/Container";

export default function Login() {
	return (
		<Home>
			<Container maxWidth="md" disableGutters={false}>
				<LoginComponent />
			</Container>
		</Home>
	);
}
