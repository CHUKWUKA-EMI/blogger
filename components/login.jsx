import React, { useState } from "react";
import { Box, Hidden, Input } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
	root: {
		paddingTop: "7em",
	},
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		fontSize: "bold",
		marginTop: "1em",
	},
	profileInfo: {
		border: "1px solid #32506D",
		padding: "0.3em 1em",
		borderRadius: "5px",
	},
}));

const Login = () => {
	const initialState = {
		email: "",
		password: "",
	};

	const initialMessages = {
		email: "",
		password: "",
		success: "",
		failure: "",
	};

	const classes = useStyles();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [state, setState] = useState(initialState);
	const [messages, setMessages] = useState(initialMessages);
	const [showPassword, setShow] = useState(false);

	React.useEffect(() => {
		router.prefetch(router.query.previousPage);
	});
	const handleChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value });
	};

	const handleSubmit = async () => {
		setLoading(true);
		const data = {
			email: state.email,
			password: state.password,
		};
		try {
			const url = process.env.API_URL + "/auth/login";
			const response = await axios.post(url, data, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.status == 201) {
				localStorage.setItem("accessToken", response.data.access_token);
				localStorage.setItem("user", JSON.stringify(response.data.user));

				if (
					router.query.previousPage != "" ||
					router.query.previousPage != null
				) {
					router.push(router.query.previousPage);
				} else {
					router.push("/posts");
				}
			}
		} catch (error) {
			setLoading(false);
			setMessages({ failure: "An error occurred. Please retry" });
			clearMessages();
		}
	};

	const clearError = (value) => {
		if (value !== "success" || value !== "failure") {
			setState({ ...state, [value]: "" });
		}
		setMessages({ ...messages, [value]: "" });
	};

	const clearMessages = () => {
		const timer = setTimeout(() => {
			clearError();
		}, 1000 * 3);

		return () => clearTimeout(timer);
	};

	return (
		<Grid className={classes.root} spacing={2} justify="center" container>
			<Hidden xsDown>
				<Grid item sm={6}>
					<Box>
						<img src="/auth.svg" alt="auth image" style={{ width: "90%" }} />
					</Box>
				</Grid>
			</Hidden>
			<Grid item xs={12} sm={6}>
				<Typography component="h1" variant="h5">
					Login
				</Typography>
				<form
					className={classes.form}
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}>
					{messages.failure && (
						<Alert
							severity="error"
							onClose={() => clearError("failure")}
							color="error">
							{messages.failure}
						</Alert>
					)}
					{messages.success && (
						<Alert
							severity="success"
							onClose={() => clearError("success")}
							color="info">
							{messages.success}
						</Alert>
					)}
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography>
								Email Address <span style={{ color: "red" }}>*</span>
							</Typography>
							<Input
								className={classes.profileInfo}
								required
								fullWidth
								value={state.email}
								onChange={handleChange}
								disableUnderline={true}
								id="email"
								name="email"
								autoComplete="email"
							/>
						</Grid>
						<Grid item xs={12}>
							<Typography>
								Password <span style={{ color: "red" }}>*</span>
							</Typography>
							<Input
								className={classes.profileInfo}
								required
								fullWidth
								disableUnderline={true}
								value={state.password}
								onChange={handleChange}
								name="password"
								type={!showPassword ? "password" : "text"}
								id="password"
								autoComplete="current-password"
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={() => setShow(!showPassword)}>
											{!showPassword ? (
												<Visibility color="primary" />
											) : (
												<VisibilityOff color="primary" />
											)}
										</IconButton>
									</InputAdornment>
								}
							/>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
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
							"Log In"
						)}
					</Button>
					<Grid style={{ marginTop: "0.5em" }} container justify="flex-end">
						<Grid item>
							<Typography style={{ fontSize: "17px" }}>
								Don't have an account yet?{" "}
								<Link
									style={{ fontWeight: "bold", color: "primary" }}
									href="/signup"
									variant="body2">
									Sign Up
								</Link>
							</Typography>
						</Grid>
					</Grid>
				</form>
			</Grid>
		</Grid>
	);
};
export default Login;
