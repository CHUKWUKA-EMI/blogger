import Home from "./index";
import Container from "@material-ui/core/Container";
import dynamic from "next/dynamic";
// import WriteComponent from "../components/write";

const WriteComponent = dynamic(() => import("../components/write"), {
	ssr: false,
});

export default function Write() {
	return (
		<Home>
			<Container maxWidth="lg" disableGutters={false}>
				<WriteComponent />
			</Container>
		</Home>
	);
}
