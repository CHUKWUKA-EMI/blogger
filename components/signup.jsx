import React, { useState, useEffect } from "react";
import {
	Box,
	Hidden,
	Input,
	InputAdornment,
	IconButton,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import { useRouter } from "next/router";
import Link from "@material-ui/core/Link";
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
		marginBottom: "1rem",
	},
	submit: {
		fontSize: "bold",
		marginTop: "2rem",
	},
	profileInfo: {
		border: "1px solid #32506D",
		padding: "0.3em 1em",
		borderRadius: "5px",
	},
}));

const initialState = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
};

const initialMessages = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	success: "",
	failure: "",
};

const SignUp = () => {
	const classes = useStyles();
	const router = useRouter();
	const [state, setState] = useState(initialState);
	const [messages, setMessages] = useState(initialMessages);
	const [loading, setLoading] = useState(false);
	const [show, setShow] = useState({
		password: false,
		passconf: false,
	});

	useEffect(() => {});

	const handleChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value });
	};

	const clearError = (value) => {
		if (value !== "failure" || value !== "success") {
			setMessages({ ...initialMessages, [value]: "" });
		}
		setMessages(initialMessages);
	};

	const clearMessages = () => {
		const timer = setTimeout(() => {
			clearError();
		}, 1000 * 3);
		return () => clearTimeout(timer);
	};

	const handleSubmit = async () => {
		setLoading(true);
		const data = {
			firstName: state.firstName,
			lastName: state.lastName,
			email: state.email,
			password: state.password,
		};
		if (
			state.firstName.trim().length == 0 ||
			state.lastName.trim().length == 0 ||
			state.email.trim().length == 0 ||
			state.password.trim().length == 0
		) {
			setMessages({
				email: "Email cannot be empty",
				password: "Password cannot be empty",
				firstName: "First name cannot be empty",
				lastName: "LastName field cannot be empty",
			});
			return;
		}
		try {
			const url = process.env.API_URL + "/user";
			const response = await axios.post(url, data, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.status == 201) {
				setLoading(false);
				setMessages({
					success:
						"Registration successful. Please check your email to activate your account.",
				});
				clearMessages();
			}
		} catch (error) {
			setLoading(false);
			setMessages({ failure: "An error occurred. Please retry" });
			clearMessages();
		}
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
					Sign Up
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
								First Name <span style={{ color: "red" }}>*</span>
							</Typography>
							<Input
								className={classes.profileInfo}
								required
								fullWidth
								disableUnderline={true}
								onChange={handleChange}
								value={state.firstName}
								id="firstName"
								name="firstName"
								autoComplete="firstName"
							/>
						</Grid>
						<Grid item xs={12}>
							<Typography>
								Last Name <span style={{ color: "red" }}>*</span>
							</Typography>
							<Input
								className={classes.profileInfo}
								required
								fullWidth
								disableUnderline={true}
								onChange={handleChange}
								value={state.lastName}
								id="lastName"
								name="lastName"
								autoComplete="lastName"
							/>
						</Grid>
						<Grid item xs={12}>
							<Typography>
								Email Address <span style={{ color: "red" }}>*</span>
							</Typography>
							<Input
								className={classes.profileInfo}
								required
								fullWidth
								disableUnderline={true}
								onChange={handleChange}
								value={state.email}
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
								onChange={handleChange}
								value={state.password}
								name="password"
								type={!show.password ? "password" : "text"}
								id="password"
								autoComplete="current-password"
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={() =>
												setShow({ ...show, password: !show.password })
											}
											onMouseDown={() =>
												setShow({ ...show, password: !show.password })
											}>
											{!show.password ? (
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
							"Sign Up"
						)}
					</Button>
					<Grid style={{ marginTop: "0.5em" }} container justify="flex-end">
						<Grid item>
							<Typography style={{ fontSize: "17px" }}>
								Already have an account?{" "}
								<Link
									style={{ fontWeight: "bold", color: "primary" }}
									href="/login"
									variant="body2">
									Log in
								</Link>
							</Typography>
						</Grid>
					</Grid>
				</form>
			</Grid>
		</Grid>
	);
};
export default SignUp;
