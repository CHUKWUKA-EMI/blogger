import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Box, Typography, Avatar, Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Skeleton from "@material-ui/lab/Skeleton";
import Divider from "@material-ui/core/Divider";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import moment from "moment";
import readTime from "reading-time";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: "100%",
		paddingTop: "5em",
		marginTop: "3em",
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
	link: {
		textDecoration: "none",
		color: "#32506D",
		display: "flex",
		alignItems: "center",
		width: "fit-content",
		"&:hover": {
			textDecoration: "underline",
		},
	},
	follow: {
		borderRadius: "1em",
		background: "#19857b",
		textTransform: "none",
		padding: "0.5em",
		fontWeight: "bold",
		color: "white",
		height: "2.5em",
		"&:hover": {
			background: "#19857b",
			color: "white",
		},
	},
}));

export default function Posts() {
	const classes = useStyles();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [posts, setPosts] = useState([]);
	const [users, setUsers] = useState([]);
	const [token, setToken] = useState(null);

	useEffect(() => {
		const authToken = localStorage.getItem("accessToken");
		if (authToken != null || authToken != "") {
			setToken(authToken);
		}
	}, []);

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const url = process.env.API_URL + "/post";
				const url2 = process.env.API_URL + "/user";
				const response = await axios.get(url);
				const users = await axios.get(url2);
				if (response.status == 200) {
					setPosts(response.data);
					setLoading(false);
				}
				if (users.status == 200) {
					setUsers(users.data);
				}
			} catch (error) {
				console.log("error", error);
			}
		})();
	}, []);

	return (
		<div className={classes.root}>
			<Grid justify="center" spacing={3} container>
				<Grid sm={3} item></Grid>
				<Grid xs={12} sm={6} item>
					{!loading ? (
						posts.length > 0 ? (
							posts.map((post) => (
								<Box style={{ marginTop: "2em" }} key={post.id}>
									<Box key={post.id}>
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
												{post.user ? (
													post.user.imageUrl != null ? (
														<Avatar
															style={{ width: "100%", height: "100%" }}
															src={post.user.imageUrl}
														/>
													) : (
														<Typography
															style={{
																fontWeight: "bold",
															}}>{`${post.user.firstName[0].toUpperCase()} ${post.user.lastName[0].toUpperCase()}`}</Typography>
													)
												) : (
													<Typography style={{ fontWeight: "bold" }}>
														UU
													</Typography>
												)}
											</Box>

											<Box
												style={{
													display: "flex",
													flexDirection: "column",
												}}>
												{post.user ? (
													<Typography
														variant="h6"
														style={{
															fontWeight: "bold",
														}}>{`${post.user.firstName} ${post.user.lastName}`}</Typography>
												) : (
													<Typography
														variant="h6"
														style={{
															fontWeight: "bold",
														}}>
														Anonymous
													</Typography>
												)}
											</Box>
										</Box>
									</Box>
									<Box style={{ marginTop: "1.5em" }}>
										<Typography
											style={{
												fontWeight: 900,
												fontSize: "2em",
											}}
											variant="body2">
											<Link href={`post/${post.slug}`}>
												<a className={classes.link}>{post.title}</a>
											</Link>
										</Typography>
										<Typography
											style={{ fontWeight: 600, color: "#19857b" }}
											variant="body1">
											{moment(post.createdAt).format("MMM DD, YYYY")} {`. `}
											{readTime(post.content).text}
										</Typography>
									</Box>
									<Divider variant="fullWidth" />
								</Box>
							))
						) : (
							<img
								style={{
									width: "50%",
									marginLeft: "auto",
									marginRight: "auto",
									marginTop: "1em",
								}}
								src="/publish_post.svg"
								alt="blog image"
							/>
						)
					) : (
						[0, 1].map((_, i) => (
							<div
								style={{
									width: "60%",
									marginLeft: "auto",
									marginRight: "auto",
								}}>
								<Skeleton variant="text" animation="wave" />
								<Skeleton
									variant="circle"
									width={40}
									height={40}
									animation="wave"
								/>
								<Skeleton
									variant="rect"
									width={`${100}%`}
									height={118}
									animation="wave"
								/>
							</div>
						))
					)}
				</Grid>
				<Grid sm={3} item>
					<Typography
						variant="body2"
						style={{ color: "black", fontWeight: "bold", fontSize: "2em" }}>
						Authors to follow
					</Typography>
					<Box
						style={{
							backgroundColor: "lightgrey",
							height: "fit-content",
							marginTop: "1em",
							padding: "0.5em",
						}}>
						{users.length > 0
							? users.map((user) => {
									return user.posts.length > 0 ? (
										<Box
											style={{
												backgroundColor: "white",
												padding: "4px",
												borderRadius: "10px",
											}}
											key={user.id}>
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
													{user.imageUrl != null ? (
														<Avatar
															style={{ width: "100%", height: "100%" }}
															src={user.imageUrl}
														/>
													) : (
														<Typography
															style={{
																fontWeight: "bold",
															}}>{`${user.firstName[0].toUpperCase()} ${user.lastName[0].toUpperCase()}`}</Typography>
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
														}}>{`${user.firstName} ${user.lastName}`}</Typography>
													<Typography
														style={{ color: "slategrey" }}
														variant="body1">
														{user.email}
													</Typography>
												</Box>
											</Box>
											<Box
												style={{
													width: "100%",
													textAlign: "center",
													marginTop: "1em",
												}}>
												<Typography
													style={{ color: "black", fontWeight: "bold" }}
													variant="body1">
													Published {user.posts.length} posts
												</Typography>
												<Button
													className={classes.follow}
													startIcon={
														<AddIcon
															style={{ fontSize: "1.5em", color: "white" }}
														/>
													}>
													Follow
												</Button>
											</Box>
										</Box>
									) : (
										""
									);
							  })
							: ""}
					</Box>
				</Grid>
			</Grid>
		</div>
	);
}
