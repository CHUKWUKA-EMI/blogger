import React, { useEffect, useState } from "react";
import Home from "../index";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
/* Use `…/dist/cjs/…` if you’re not in ESM! */
import { xterm } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { makeStyles } from "@material-ui/core/styles";
import {
	IconButton,
	Grid,
	Box,
	Typography,
	Avatar,
	Button,
	Divider,
	Tooltip,
	TextareaAutosize,
} from "@material-ui/core";
import {
	ArrowBack,
	ModeCommentOutlined,
	ThumbUp,
	ThumbUpOutlined,
	ShareOutlined,
	Close,
	Send,
} from "@material-ui/icons";
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
	messageBox: {
		borderRadius: "10px",
		border: "1px solid #C8C8C8",
		margin: "2em 1em",
		marginBottom: 0,
		marginTop: "5em",
	},
	messageArea: {
		display: "flex",
		background: "#fff",
		padding: "0.7em",
		borderTopLeftRadius: "10px",
		borderTopRightRadius: "10px",
		"@media screen and (max-width: 760px)": {
			padding: "0.7em",
		},
	},
	messageInput: {
		border: "none",
		outline: "none",
		color: "rgba(0, 0, 0, 0.6)",
		width: "100%",
		marginRight: "1em",
		lineHeight: "1.3em",
		"@media screen and (max-width: 760px)": {
			fontSize: "0.9em",
		},
	},
	button: {
		border: "1px solid #00487C",
		boxShadow: "none",
		fontWeight: "600",
		borderRadius: "8px",
		color: "white",
	},
	messageBottom: {
		background: "#32506D",
		padding: "0.6em",
		borderBottomLeftRadius: "10px",
		borderBottomRightRadius: "10px",
		borderTop: "1px solid #C8C8C8",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
	mkd: {},
}));

function Post({ post }) {
	const classes = useStyles();
	const router = useRouter();
	const [singlePost, setSinglePost] = useState(post);
	const [openComment, setOpenComment] = useState(false);

	return (
		<Home>
			<Grid className={classes.root} justify="center" container>
				<Grid
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
					}}
					sm={3}
					item>
					<Divider
						style={{ width: "60%", alignSelf: "center" }}
						variant="middle"
					/>
					<Box
						style={{
							display: "flex",
							alignItems: "center",
							width: "fit-content",
							marginRight: "auto",
							marginLeft: "auto",
							justifyContent: "space-between",
							paddingTop: "0.5em",
						}}>
						<div style={{ display: "flex", alignItems: "center" }}>
							<Tooltip color="primary" title="Like" placement="top" arrow>
								<IconButton>
									<ThumbUpOutlined color="primary" />
								</IconButton>
							</Tooltip>
							<Typography>
								{singlePost.likes.length > 0 ? singlePost.likes.length : ""}
							</Typography>
						</div>
						<div style={{ display: "flex", alignItems: "center" }}>
							<Tooltip color="primary" title="Comment" placement="top" arrow>
								<IconButton onClick={() => setOpenComment(true)}>
									<ModeCommentOutlined color="primary" />
								</IconButton>
							</Tooltip>
							<Typography>
								{singlePost.comments.length > 0
									? singlePost.comments.length
									: ""}
							</Typography>
						</div>
						<Tooltip color="primary" title="Share" placement="top" arrow>
							<IconButton>
								<ShareOutlined color="primary" />
							</IconButton>
						</Tooltip>
					</Box>
				</Grid>
				<Grid xs={12} sm={6} item>
					<Typography style={{ display: "flex", alignItems: "center" }}>
						<Button
							color="primary"
							style={{
								fontSize: "1em",
								fontWeight: "bold",
							}}
							onClick={() => router.back()}
							startIcon={
								<ArrowBack style={{ fontSize: "2em" }} color="primary" />
							}>
							BACK TO BLOGS
						</Button>
					</Typography>
					<Typography
						style={{ fontWeight: 900, marginTop: "1em" }}
						variant="h4">
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
				<Grid style={{ paddingLeft: "1em", paddingRight: "1em" }} sm={3} item>
					{openComment ? (
						<Box
							style={{
								width: "100%",
								height: "100%",
								border: "1px solid #32506D",
								display: "flex",
								flexDirection: "column",
							}}>
							<Box
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									height: "3em",
									width: "100%",
									backgroundColor: "#32506D",
									padding: "0.5em",
								}}>
								<Box>
									<Typography style={{ fontWeight: 900, color: "white" }}>
										Thread
									</Typography>
									<Typography style={{ fontWeight: 600, color: "white" }}>
										#
										{`${singlePost.user.firstName.toLowerCase()}_${singlePost.user.lastName.toLowerCase()}`}
									</Typography>
								</Box>

								<IconButton onClick={() => setOpenComment(false)}>
									<Close style={{ color: "white" }} />
								</IconButton>
							</Box>
							<Box></Box>
							<Box style={{ width: "100%" }}>
								<form className={classes.messageBox}>
									<div className={classes.messageArea}>
										<TextareaAutosize
											name="message"
											autoComplete="true"
											rowsMin={2}
											className={classes.messageInput}
											placeholder="Comment"
											onKeyDown={(e) => {}}
										/>
									</div>

									<div className={classes.messageBottom}>
										<div></div>
										<Button
											className={classes.button}
											style={{ backgroundColor: "white", color: "#32506D" }}
											variant="contained"
											size="small"
											type="submit">
											<Send />
										</Button>
									</div>
								</form>
							</Box>
						</Box>
					) : (
						""
					)}
				</Grid>
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
