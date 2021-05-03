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
import CircularProgress from "@material-ui/core/CircularProgress";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor5-custom-build/build/ckeditor";
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

	const onEditorChange = async (event, editor) => {
		const data = editor.getData();
		setPost({ ...post, content: data });
	};

	const handleSubmit = async () => {
		if (post.title == "" || post.content == "") {
			setMessage("Please fill out all fields");
			setOpenSnack(true);
			return;
		}

		setLoading(true);
		const data = {
			title: post.title,
			content: post.content,
		};
		try {
			const url = process.env.API_URL + "/post";
			const response = await axios.post(url, JSON.stringify(data), {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status == 201) {
				setPost({ title: "", content: "" });
				setMessage("Post created successfully");
				setLoading(false);
				setOpenSnack(true);
				router.push("/posts");
			} else {
				setLoading(false);
				setMessage("Post creation failed");
			}
		} catch (error) {
			setLoading(false);
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
							Content
						</Typography>
						<CKEditor
							editor={ClassicEditor}
							data=""
							onChange={onEditorChange}
							config={{
								toolbar: {
									items: [
										"heading",
										"paragraph",
										"code",
										"|",
										"bold",
										"italic",
										"underline",
										"imageUpload",

										"|",
										"fontFamily",
										"fontSize",
										"fontColor",
										"fontBackgroundColor",
										"|",
										"alignment",
										"outdent",
										"indent",
										"bulletedList",
										"numberedList",
										"blockQuote",
										"|",
										"link",
										"insertTable",
										"strikethrough",
										"codeBlock",
										"|",
										"undo",
										"redo",
										"highlight",
									],
									shouldNotGroupWhenFull: true,
								},
								heading: {
									options: [
										{
											model: "paragraph",
											view: "p",
											title: "Paragraph",
											class: "ck-heading_paragraph",
										},
										{
											model: "heading1",
											view: "h1",
											title: "Heading 1",
											class: "ck-heading_heading1",
										},
										{
											model: "heading2",
											view: "h2",
											title: "Heading 2",
											class: "ck-heading_heading2",
										},
										{
											model: "heading3",
											view: "h3",
											title: "Heading 3",
											class: "ck-heading_heading3",
										},
									],
								},
								fontSize: {
									options: [
										9,
										10,
										11,
										12,
										13,
										14,
										15,
										16,
										17,
										18,
										19,
										20,
										21,
										23,
										25,
										27,
										29,
										31,
										33,
										35,
									],
								},
								fontFamily: {
									supportAllValues: true,
								},
								alignment: {
									options: ["justify", "left", "center", "right"],
								},

								table: {
									contentToolbar: [
										"tableColumn",
										"tableRow",
										"mergeTableCells",
									],
								},
								image: {
									resizeUnit: "px",
									toolbar: [
										"imageStyle:alignLeft",
										"imageStyle:full",
										"imageStyle:alignRight",
										"|",
										"imageTextAlternative",
									],
									styles: ["full", "alignLeft", "alignRight"],
								},
								typing: {
									transformations: {
										remove: [
											"enDash",
											"emDash",
											"oneHalf",
											"oneThird",
											"twoThirds",
											"oneForth",
											"threeQuarters",
										],
									},
								},
								placeholder: "What do you have to share today?",
							}}
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
