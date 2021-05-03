import PostsComponent from "../components/posts";
import Home from "./index";
import Container from "@material-ui/core/Container";

export default function Posts() {
	return (
		<Home>
			<Container maxWidth="lg" disableGutters={false}>
				<PostsComponent />
			</Container>
		</Home>
	);
}
