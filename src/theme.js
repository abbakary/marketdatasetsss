import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF8C00", // Vibrant Orange
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#20B2AA", // Teal
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F5F7FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A202C",
      secondary: "#4A5568",
    },
  },

  typography: {
    fontFamily: "Poppins, sans-serif",

    h1: {
      fontWeight: 700,
    },

    h2: {
      fontWeight: 600,
    },

    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },

  shape: {
    borderRadius: 10,
  },
});

export default theme;
