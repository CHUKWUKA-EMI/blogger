import Head from "next/head";
import Header from "../components/header";
import Container from "@material-ui/core/Container";

export default function Home(props) {
	return (
		<div>
			<Head>
				<title>Blog</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header dynamicPath={props.dynamicPath} />
			{props.children}
		</div>
	);
}
