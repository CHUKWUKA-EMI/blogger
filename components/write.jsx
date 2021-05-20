import React, { useEffect, useState, useRef } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Skeleton from "@material-ui/lab/Skeleton";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import ClearIcon from "@material-ui/icons/Clear";
import CircularProgress from "@material-ui/core/CircularProgress";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "highlight.js/styles/github.css";
import hljs from "highlight.js";
import "react-markdown-editor-lite/lib/index.css";
import { useRouter } from "next/router";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
	root: {
		paddingTop: "10em",
		display: "flex",
		flexGrow: 1,
		width: "100%",
		overflowX: "hidden",
	},
	form: {
		width: "100%", // Fix IE 11 issue.

		marginBottom: "1rem",
	},
	submit: {
		fontSize: "bold",
		marginRight: "auto",
		marginLeft: "auto",
	},
	profileInfo: {
		border: "1.5px solid #32506D",
		padding: "0.3em 1em",
		borderRadius: "5px",
	},
	skeleton: {
		width: "100%",
	},
}));

function Write() {
	const classes = useStyles();
	const router = useRouter();

	const editorRef = useRef();
	const [editorLoader, setEditorLoaded] = useState(false);
	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState(null);
	const [openSnack, setOpenSnack] = useState(false);
	const [message, setMessage] = useState("");
	const [post, setPost] = useState({ title: "", content: "", image: null });
	const [imgPreview, setImgPreview] = useState(null);

	const mdParser = new MarkdownIt({
		highlight: function (str, lang) {
			if (lang && hljs.getLanguage(lang)) {
				try {
					return hljs.highlight(str, { lang, ignoreIllegals }).value;
				} catch (__) {}
			}
			return ""; // use external default escaping
		},
		typographer: true,
		linkify: true,
	});

	useEffect(() => {
		const authToken = localStorage.getItem("accessToken");
		if (authToken == null || authToken == "") {
			router.push("/login");
		}
		setToken(authToken);
		setEditorLoaded(true);
	}, []);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpenSnack(false);
	};

	const handleEditorChange = ({ html, text }) => {
		console.log("handleEditorChange", typeof text, text.toString());
		setPost({ ...post, content: text.toString() });
	};

	const uploadToCloudinary = async (image) => {
		const url = "https://api.cloudinary.com/v1_1/chukwuka/auto/upload";
		const formData = new FormData();
		formData.append("file", image);
		formData.append("upload_preset", "blog_cover_images");

		try {
			const response = await axios.post(url, formData);
			return response;
		} catch (err) {
			return err.message;
		}
	};

	const handleImage = (event) => {
		setPost({ ...post, image: event.target.files[0] });
		setImgPreview(URL.createObjectURL(event.target.files[0]));
	};

	const handleSubmit = async () => {
		if (post.title == "" || post.content == "") {
			setMessage("Please fill out all fields");
			setOpenSnack(true);
			return;
		}

		setLoading(true);

		try {
			const cloudRes = await uploadToCloudinary(post.image);
			if (cloudRes.status == 200) {
				const data = {
					title: post.title,
					content: post.content,
					image: cloudRes.data.secure_url,
				};

				const url = process.env.API_URL + "/post";
				const response = await axios.post(url, JSON.stringify(data), {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (response.status == 201) {
					setPost({ title: "", content: "" });
					setImgPreview(null);
					setMessage("Post created successfully");
					setLoading(false);
					setOpenSnack(true);
					router.push("/posts");
				} else {
					setLoading(false);
					setMessage("Post creation failed");
				}
			} else {
				const fileReader = new FileReader();
				fileReader.readAsDataURL(post.image);
				fileReader.onload = async () => {
					const data = {
						title: post.title,
						content: post.content,
						image: fileReader.result,
					};

					const url = process.env.API_URL + "/post";
					const response = await axios.post(url, JSON.stringify(data), {
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					});

					if (response.status == 201) {
						setPost({ title: "", content: "" });
						setImgPreview(null);
						setMessage("Post created successfully");
						setLoading(false);
						setOpenSnack(true);
						router.push("/posts");
					} else {
						setLoading(false);
						setPost({ title: "", content: "" });
						setImgPreview(null);
						setMessage("Post creation failed");
					}
				};
			}
		} catch (error) {
			setLoading(false);
			setPost({ title: "", content: "" });
			setImgPreview(null);
			setMessage("Sorry, an Error occurred. Please retry");
			setOpenSnack(true);
		}
	};

	return (
		<Grid className={classes.root} spacing={6} justify="center" container>
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
						<Button style={{ color: "red" }} size="small" onClick={handleClose}>
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
			<Grid item md={4}>
				<Typography variant="h5">
					Publish Your Posts And Inspire The World...
				</Typography>
				<img
					style={{ width: "100%", marginTop: "1em" }}
					src="/publish_post.svg"
					alt="blog image"
				/>
			</Grid>
			<Grid item xs={12} md={8}>
				{editorLoader ? (
					<form
						className={classes.form}
						onSubmit={(e) => {
							e.preventDefault();
							handleSubmit();
						}}>
						<Typography
							style={{ fontSize: "2em", fontWeight: "900" }}
							color="primary">
							Title
						</Typography>
						<Input
							className={classes.profileInfo}
							name="title"
							disableUnderline={true}
							value={post.title}
							onChange={(e) => setPost({ title: e.target.value })}
							required
							placeholder="Give it a title..."
							fullWidth
							id="title"
							autoFocus
						/>
						<Typography
							style={{ fontSize: "2em", fontWeight: "900", marginTop: "1em" }}
							color="primary">
							Upload Cover Image
						</Typography>
						{imgPreview != null && <img src={imgPreview} />}
						<input
							accept="image/*"
							style={{ display: "none" }}
							id="contained-button-file"
							multiple
							type="file"
							onChange={handleImage}
						/>
						<div style={{ display: "flex", alignItems: "center" }}>
							<label htmlFor="contained-button-file">
								<Button
									startIcon={<CloudUploadIcon />}
									variant="contained"
									color="primary"
									style={{ marginTop: "0.5em" }}
									component="span">
									Upload
								</Button>
							</label>
							{imgPreview != null && (
								<Button
									startIcon={<ClearIcon style={{ color: "red" }} />}
									variant="contained"
									style={{
										marginTop: "0.5em",
										marginLeft: "0.5em",
										backgroundColor: "white",
										border: "1px solid #32506D",
										color: "red",
										fontWeight: "bold",
									}}
									onClick={() => setImgPreview(null)}
									component="span">
									Clear
								</Button>
							)}
						</div>

						<Typography
							style={{ fontSize: "2em", fontWeight: "900", marginTop: "1em" }}
							color="primary">
							Content
						</Typography>

						<MdEditor
							style={{ height: "15em" }}
							renderHTML={(text) => mdParser.render(text)}
							onChange={handleEditorChange}
						/>
						<Button
							type="submit"
							variant="contained"
							fullWidth
							color="primary"
							style={{
								background: "#32506D",
								border: "1px solid #32506D",
								color: "#fff",
							}}
							className={classes.submit}>
							{loading ? (
								<CircularProgress size="2em" style={{ color: "#fff" }} />
							) : (
								"Publish"
							)}
						</Button>
					</form>
				) : (
					<div className={classes.skeleton}>
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
					</div>
				)}
			</Grid>
		</Grid>
	);
}
export default Write;
