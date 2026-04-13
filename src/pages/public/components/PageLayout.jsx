import { Box } from "@mui/material";
import NavBar from "./NavBars";
import Footer from "./Footer";

export default function PageLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f6f7fb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavBar />

      <Box sx={{ flex: 1 }}>{children}</Box>

      <Footer />
    </Box>
  );
}
