import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createMuiTheme({
	palette: {
		primary: {
			main: "#32506D",
		},
		secondary: {
			main: "#19857b",
		},
		error: {
			main: red.A400,
		},
		background: {
			default: "#fff",
		},
	},
	typography: {
		fontFamily: ['"Gentium Book Basic"', "serif"].join(","),
	},
	overrides: {
		MuiCssBaseline: {
			"@global": {
				"@font-face": ["Gentium Book Basic"],
			},
		},
		MUIRichTextEditor: {
			root: {
				marginTop: 20,
				width: "60%",
			},
			toolbar: {
				backgroundColor: "#F4F7F9",
				"& .MuiIconButton-root": {
					color: "#32506D",
				},
			},
			editor: {
				border: "1px solid #32506D",
				height: "10rem",
				padding: "1em",
			},
		},
	},
});
export default theme;
