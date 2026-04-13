import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        py: 3,
        textAlign: "center",
        borderTop: "1px solid #e5e7eb",
        background: "white",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} DaliData. All rights reserved.
      </Typography>
    </Box>
  );
}
