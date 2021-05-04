import React from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
	Reorder,
	PostAdd,
	ViewStream,
	Person,
	FiberManualRecord,
} from "@material-ui/icons";
import { useRouter } from "next/router";

const drawerWidth = 15;

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		backgroundColor: "#F4F7F9",
	},
	drawer: {
		[theme.breakpoints.up("sm")]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	appBar: {
		backgroundColor: "#fff",
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up("sm")]: {
			display: "none",
		},
	},
	// necessary for content to be below app bar
	toolbar: theme.mixins.toolbar,
	drawerPaper: {
		width: `${drawerWidth}%`,
		[theme.breakpoints.down("xs")]: {
			width: 250,
		},
	},

	navbutton: {
		color: "rgba(0,0,0,0.6)",
		textTransform: "capitalize",
		fontSize: "1.10em",
		fontWeight: 700,
		padding: "0 1em",
		"&:hover": {
			background: "none",
			textDecoration: "underline",
		},
		"&:active": {
			background: "none",
			textDecoration: "underline",
		},
		"@media screen and (max-width: 959px)": {
			padding: "0 1em",
			fontSize: "1em",
			textAlign: "right",
		},
		"@media screen and (max-width: 760px)": {
			textAlign: "left",
		},
	},
}));

function Header(props) {
	const { window } = props;
	const classes = useStyles();
	const router = useRouter();
	const theme = useTheme();
	const [mobileOpen, setMobileOpen] = React.useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const navLinks = [
		{
			name: "Blogs",
			href: "/posts",
			icon: <Reorder style={{ color: "#32506D" }} />,
		},
		{
			name: "Write",
			href: "/write",
			icon: <PostAdd style={{ color: "#32506D" }} />,
		},
		// {
		// 	name: "My Activities",
		// 	href: "/activities",
		// 	icon: <ViewStream style={{ color: "#32506D" }} />,
		// },
		{
			name: "Login",
			href: "/login",
			icon: <Person style={{ color: "#32506D" }} />,
		},
	];

	const drawer = (
		<div>
			<div className={classes.toolbar} />
			<Divider />
			<List>
				{navLinks.map((nav, index) => (
					<ListItem button key={index}>
						<ListItemIcon>{nav.icon}</ListItemIcon>
						<ListItemText primary={nav.name} />
					</ListItem>
				))}
			</List>
		</div>
	);

	const container =
		window !== undefined ? () => window().document.body : undefined;

	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar elevation={1} position="fixed" className={classes.appBar}>
				<Toolbar>
					<Hidden smUp>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							className={classes.menuButton}>
							<MenuIcon style={{ color: "#32506D" }} />
						</IconButton>
					</Hidden>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							width: "100%",
							paddingLeft: "3em",
							paddingRight: "3em",
						}}>
						<Typography
							style={{
								backgroundColor: "#32506D",
								fontWeight: 900,
								display: "flex",
								alignItems: "center",
								height: "2em",
							}}
							variant="h6"
							noWrap>
							<FiberManualRecord style={{ color: "white" }} />
							<FiberManualRecord style={{ color: "white" }} />
							<FiberManualRecord style={{ color: "white" }} />
						</Typography>
						<div style={{ display: "flex", alignItems: "center" }}>
							<Hidden xsDown>
								{navLinks.map((nav, index) => (
									<Button
										href={nav.href}
										className={classes.navbutton}
										key={index}
										endIcon={nav.icon}>
										{nav.name}
									</Button>
								))}
							</Hidden>
						</div>
					</div>
				</Toolbar>
			</AppBar>
			<nav className={classes.drawer} aria-label="blog nav">
				<Hidden smUp implementation="js">
					<Drawer
						container={container}
						variant="temporary"
						anchor={theme.direction === "rtl" ? "right" : "left"}
						open={mobileOpen}
						onClose={handleDrawerToggle}
						classes={{
							paper: classes.drawerPaper,
						}}
						ModalProps={{
							keepMounted: true, // Better open performance on mobile.
						}}>
						{drawer}
					</Drawer>
				</Hidden>
			</nav>
		</div>
	);
}
export default Header;
