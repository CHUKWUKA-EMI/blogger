import React, { useEffect, useState, useRef } from "react";
import Home from "../index";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
/* Use `…/dist/cjs/…` if you’re not in ESM! */
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";
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
	Hidden,
} from "@material-ui/core";
import {
	ArrowBack,
	ThumbUp,
	ThumbUpOutlined,
	ShareOutlined,
	Close as CloseIcon,
	DeleteForever,
	Edit,
} from "@material-ui/icons";
import Snackbar from "@material-ui/core/Snackbar";
import axios from "axios";
import { useRouter } from "next/router";
import moment from "moment";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: "100%",
		paddingTop: "7em",
		[theme.breakpoints.down("xs")]: {
			paddingRight: "1.5em",
			paddingLeft: "1.5em",
		},
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
		marginBottom: "1.5em",
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
		color: "black",
		width: "100%",
		marginRight: "1em",
		lineHeight: "1.3em",
		fontSize: "1em",
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
	likeAndShare: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		// width: "fit-content",
		paddingLeft: "5em",
		justifyContent: "space-between",
		paddingTop: "0.5em",
		position: "fixed",
	},
	mkd: {},
}));

function Post({ post }) {
	const classes = useStyles();
	const router = useRouter();
	const commentRef = useRef(null);
	const [loading, setLoading] = useState(false);
	const [singlePost, setSinglePost] = useState(post);
	const [token, setToken] = useState(null);
	const [comment, setComment] = useState("");
	const [comments, setComments] = useState([]);
	const [openSnack, setOpenSnack] = useState(false);
	const [message, setMessage] = useState("");
	const [liked, setLiked] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		const authToken = localStorage.getItem("accessToken");
		setToken(authToken);
		const user = JSON.parse(localStorage.getItem("user"));
		setCurrentUser(user);
		if (user != null) {
			const userLike = post.likes.find((c) => c.likerId == user.id);
			if (userLike != null) {
				setLiked(true);
			}
		}
	}, []);

	useEffect(() => {
		const update = () => setComments(post.comments.sort((a, b) => b.id - a.id));
		update();
	}, [comments]);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpenSnack(false);
	};

	const scrollToBottom = () => {
		const box = document.getElementById("box");
		box.scrollIntoView({ behavior: "smooth" });
	};

	const addComment = async () => {
		if (token == null) {
			router.push(`/login?previousPage=post/${post.slug}`);
		}

		const data = {
			content: comment,
			postId: singlePost.id,
		};

		setLoading(true);
		try {
			const url = process.env.API_URL + "/comment";
			const response = await axios.post(url, JSON.stringify(data), {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status == 201) {
				setLoading(false);
				scrollToBottom();
				setComments([...comments.unshift(response.data)]);

				setComment("");
			} else {
				setComment("");
				setLoading(false);
				setMessage(
					"Comment could not be added due to some technical glitches. Please contact the owner of this blog site."
				);
				setOpenSnack(true);
			}
		} catch (err) {
			setComment("");
			setLoading(false);
		}
	};

	const deleteComment = async (id) => {
		if (token == null) {
			router.push(`/login?previousPage=post/${post.slug}`);
		}
		try {
			const url = process.env.API_URL + "/comment";
			const response = await axios.delete(`${url}/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status == 200) {
				_.remove(comments, (c) => c.id == id);
				setMessage("Comment deleted");
				setOpenSnack(true);
			}
		} catch (error) {
			console.log("error", error);
		}
	};

	const likePost = async () => {
		if (token == null) {
			router.push(`/login?previousPage=post/${post.slug}`);
		}
		if (liked) {
			return;
		}

		try {
			const url = process.env.API_URL + "/like";
			const response = await axios.post(
				url,
				JSON.stringify({ value: true, postId: post.id }),
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status == 201) {
				setLiked(true);
			}
		} catch (e) {}
	};

	return (
		<Home dynamicPath={`/post/${post.slug}`}>
			<Grid className={classes.root} justify="center" container>
				<Snackbar
					anchorOrigin={{
						vertical: "top",
						horizontal: "right",
					}}
					open={openSnack}
					autoHideDuration={6000}
					onClose={handleClose}
					message={message}
					action={
						<React.Fragment>
							<Button
								style={{ color: "red" }}
								size="small"
								onClick={handleClose}>
								UNDO
							</Button>
							<IconButton
								size="small"
								aria-label="close"
								color="inherit"
								onClick={handleClose}>
								<CloseIcon fontSize="small" />
							</IconButton>
						</React.Fragment>
					}
				/>
				<Grid
					style={{
						display: "flex",
						flexDirection: "column",
						// justifyContent: "center",
						paddingTop: "5em",
					}}
					sm={3}
					item>
					<Hidden xsDown>
						<Box className={classes.likeAndShare}>
							<div style={{ display: "flex", alignItems: "center" }}>
								<Tooltip color="primary" title="Like" placement="top" arrow>
									<IconButton
										onClick={(e) => {
											e.stopPropagation();
											likePost();
										}}>
										{!liked ? (
											<ThumbUpOutlined color="primary" />
										) : (
											<ThumbUp color="primary" />
										)}
									</IconButton>
								</Tooltip>
								<Typography>
									{singlePost.likes.length > 0 ? singlePost.likes.length : ""}
								</Typography>
							</div>

							<Tooltip color="primary" title="Share" placement="top" arrow>
								<IconButton>
									<ShareOutlined color="primary" />
								</IconButton>
							</Tooltip>
						</Box>
					</Hidden>
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
									}}>
									{`${singlePost.user.firstName} ${singlePost.user.lastName}`}{" "}
									<span
										style={{
											fontSize: "13px",
											border: "1px solid #19857b",
											padding: "1px",
											borderRadius: "5px",
											background:
												"repeating-radial-gradient(black, transparent 100px)",
											color: "mintcream",
										}}>
										Author
									</span>
								</Typography>
								<Typography style={{ color: "slategrey" }} variant="body1">
									{moment(singlePost.createdAt).format("Do of MMM, YYYY")}
								</Typography>
							</Box>
						</Box>
					</Box>
					{singlePost.image != null && (
						<Box style={{ width: "100%" }}>
							<img
								style={{ width: "100%" }}
								src={singlePost.image}
								alt="blog cover image"
							/>
						</Box>
					)}
					<ReactMarkdown
						className={classes.mkd}
						remarkPlugins={[gfm]}
						children={singlePost.content}
						components={{
							code: Component,
						}}
					/>
					<Divider variant="fullWidth" />
					<Hidden smUp>
						<>
							<Box
								style={{
									display: "flex",
									alignItems: "center",
									paddingLeft: "1em",
									paddingRight: "1em",
									justifyContent: "space-between",
									paddingTop: "0.5em",
								}}>
								<div style={{ display: "flex", alignItems: "center" }}>
									<Tooltip color="primary" title="Like" placement="top" arrow>
										<IconButton
											onClick={(e) => {
												e.stopPropagation();
												likePost();
											}}>
											{!liked ? (
												<ThumbUpOutlined color="primary" />
											) : (
												<ThumbUp color="primary" />
											)}
										</IconButton>
									</Tooltip>
									<Typography>
										{singlePost.likes.length > 0 ? singlePost.likes.length : ""}
									</Typography>
								</div>

								<Tooltip color="primary" title="Share" placement="top" arrow>
									<IconButton>
										<ShareOutlined color="primary" />
									</IconButton>
								</Tooltip>
							</Box>
							<Divider variant="fullWidth" />
						</>
					</Hidden>
					<Box
						style={{
							width: "100%",
						}}>
						<Typography
							style={{
								fontWeight: 900,
								fontSize: "1.5em",
								marginTop: "0.5em",
								marginBottom: "0.5em",
							}}>
							Comments
							{`${comments.length > 0 ? "(" + comments.length + ")" : ""}`}
						</Typography>
						{token == null && (
							<Typography
								color="primary"
								style={{
									fontWeight: 900,
									fontSize: "1em",

									marginBottom: "0.5em",
								}}>
								You must login before you can comment on this post
							</Typography>
						)}
						<Box style={{ width: "100%" }}>
							<form
								className={classes.messageBox}
								onSubmit={(e) => {
									e.preventDefault();
									addComment();
								}}>
								<div className={classes.messageArea}>
									<TextareaAutosize
										name="message"
										autoComplete="true"
										rowsMin={2}
										className={classes.messageInput}
										placeholder="Drop your comment"
										value={comment}
										onChange={(e) => setComment(e.target.value)}
										// onKeyDown={(e) => {
										// 	if ((e.key = "Enter")) {
										// 		e.preventDefault();
										// 		addComment();
										// 	}
										// }}
									/>
								</div>

								<div className={classes.messageBottom}>
									<div></div>
									{token != null ? (
										<Button
											className={classes.button}
											style={{
												backgroundColor: !loading ? "white" : "#ada8a8",
												color: !loading ? "#32506D" : "black",
											}}
											variant="contained"
											size="small"
											type="submit">
											{!loading ? "Submit" : "Processing..."}
										</Button>
									) : (
										<Button
											className={classes.button}
											style={{ backgroundColor: "white", color: "#32506D" }}
											variant="contained"
											size="small"
											onClick={() =>
												router.push(`/login?previousPage=post/${post.slug}`)
											}>
											Login
										</Button>
									)}
								</div>
							</form>
							{comments.length > 0 && (
								<Box id="box" style={{ marginTop: "2em", width: "100%" }}>
									{comments.map((comment) => (
										<>
											<div
												key={comment.id}
												style={{
													padding: "4px",
													marginTop: "1em",
													display: "flex",
													flexDirection: "column",
													width: "100%",
												}}>
												<Box
													style={{
														display: "flex",
														justifyContent: "space-between",
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
															{comment.userAvatar != null ? (
																<Avatar
																	style={{ width: "100%", height: "100%" }}
																	src={comment.userAvatar}
																/>
															) : (
																<Typography
																	style={{
																		fontWeight: "bold",
																	}}>{`${comment.userName
																	.split(" ")[0][0]
																	.toUpperCase()} ${comment.userName
																	.split(" ")[1][0]
																	.toUpperCase()}`}</Typography>
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
																}}>
																{comment.userName}
															</Typography>
															<Typography
																style={{ color: "slategrey" }}
																variant="body1">
																{moment(comment.createdAt).format(
																	"Do of MMM, YYYY"
																)}
															</Typography>
														</Box>
													</Box>
													{comment.commenterId == currentUser.id && (
														<div
															style={{
																display: "flex",
																alignItems: "center",
																justifyContent: "space-between",
																width: "20%",
																paddingRight: "1em",
																paddingTop: "1em",
															}}>
															<Button
																endIcon={<Edit style={{ color: "white" }} />}
																size="small"
																color="secondary"
																style={{ fontSize: "14px", fontWeight: "bold" }}
																variant="contained">
																Edit
															</Button>
															<IconButton
																onClick={() => deleteComment(comment.id)}>
																<DeleteForever style={{ color: "red" }} />
															</IconButton>
														</div>
													)}
												</Box>
												<Box
													style={{
														marginLeft: "1em",
														width: "100%",
														padding: "1em",
													}}>
													<Typography>{comment.content}</Typography>
												</Box>
											</div>
											<Divider variant="fullWidth" />
										</>
									))}
								</Box>
							)}
						</Box>
					</Box>
				</Grid>
				<Grid
					style={{ paddingLeft: "1em", paddingRight: "1em" }}
					sm={3}
					item></Grid>
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
	console.log("singlePost", post);
	// Pass post data to the page via props
	return { props: { post } };
}

export default Post;

const Component = ({ node, inline, className, children, ...props }) => {
	const match = /language-(\w+)/.exec(className || "");
	return (
		<SyntaxHighlighter
			style={tomorrow}
			language={match != null ? match[1] : null}
			children={String(children).replace(/\n$/, "")}
			{...props}
		/>
	);
};
