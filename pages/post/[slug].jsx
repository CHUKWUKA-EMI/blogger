import React, { useEffect, useState } from "react";
import Home from "../index";
import sanitize from "sanitize-html";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
/* Use `…/dist/cjs/…` if you’re not in ESM! */
import { xterm } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Grid, Box, Typography, Avatar } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import Skeleton from "@material-ui/lab/Skeleton";
import axios from "axios";
import { useRouter } from "next/router";
import moment from "moment";
import readTime from "reading-time";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: "100%",
		paddingTop: "7em",
	},
	card: {
		width: "60%",
		marginLeft: "auto",
		marginRight: "auto",
		marginTop: "1em",
		[theme.breakpoints.down("sm")]: {
			width: "100%",
		},
	},
	media: {
		height: 190,
	},
	mkd: {},
}));

function Post({ post }) {
	const classes = useStyles();
	const router = useRouter();
	const [singlePost, setSinglePost] = useState(post);

	return (
		<Home>
			<Grid className={classes.root} justify="center" container>
				<Grid sm={3} item></Grid>
				<Grid xs={12} sm={6} item>
					<Typography style={{ display: "flex", alignItems: "center" }}>
						<IconButton onClick={() => router.back()}>
							<ArrowBack />
							<Typography>BACK TO BLOGS</Typography>
						</IconButton>
					</Typography>
					<Typography style={{ fontWeight: 900 }} variant="h4">
						{singlePost.title}
					</Typography>
					<Box
						style={{
							padding: "4px",
							marginTop: "1em",
						}}>
						<Box
							style={{
								display: "flex",
								alignItems: "center",
							}}>
							<Box
								style={{
									borderRadius: "50%",
									height: "4em",
									width: "4em",
									backgroundColor: "#32506D",
									color: "white",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									marginRight: "1em",
								}}>
								{singlePost.user.imageUrl != null ? (
									<Avatar
										style={{ width: "100%", height: "100%" }}
										src={singlePost.user.imageUrl}
									/>
								) : (
									<Typography
										style={{
											fontWeight: "bold",
										}}>{`${singlePost.user.firstName[0].toUpperCase()} ${singlePost.user.lastName[0].toUpperCase()}`}</Typography>
								)}
							</Box>

							<Box
								style={{
									display: "flex",
									flexDirection: "column",
								}}>
								<Typography
									variant="h6"
									style={{
										fontWeight: "bold",
									}}>{`${singlePost.user.firstName} ${singlePost.user.lastName}`}</Typography>
								<Typography style={{ color: "slategrey" }} variant="body1">
									{moment(singlePost.createdAt).format("Do of MMM, YYYY")}
								</Typography>
							</Box>
						</Box>
					</Box>
					<ReactMarkdown
						className={classes.mkd}
						children={singlePost.content}
						remarkPlugins={[gfm]}
						components={{
							code: Component,
						}}
					/>
				</Grid>
				<Grid sm={3} item></Grid>
			</Grid>
		</Home>
	);
}

export async function getStaticPaths() {
	// Call an external API endpoint to get posts
	const url = process.env.API_URL + "/post";
	const res = await fetch(url);
	const posts = await res.json();

	// Get the paths we want to pre-render based on posts
	const paths = posts.map((post) => ({
		params: { slug: post.slug },
	}));

	// We'll pre-render only these paths at build time.
	// { fallback: false } means other routes should 404.
	return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
	// params contains the post `slug`.
	// If the route is like /posts/a-b-c, then params.slug is a-b-c
	const url = process.env.API_URL + "/post";
	const res = await fetch(`${url}/${params.slug}`);
	const post = await res.json();

	// Pass post data to the page via props
	return { props: { post } };
}

export default Post;

const Component = ({ node, inline, className, children, ...props }) => {
	const match = /language-(\w+)/.exec(className || "");
	return (
		<SyntaxHighlighter
			style={xterm}
			language={match != null ? match[1] : null}
			children={String(children).replace(/\n$/, "")}
			{...props}
		/>
	);
};
