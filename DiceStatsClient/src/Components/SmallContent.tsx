import * as React from "react";
import { Paper, Container } from "@mui/material";

export default function SmallContent({ children }: any) {
  return (
    <Container disableGutters>
      <Paper
        elevation={3}
        sx={{
          backgroundColor: "#333333",
          color: "#e0e0e0",
          padding: "16px",
          textAlign: "center",
          maxWidth: "300px",
          margin: "5px auto",
        }}
      >
        {children}
      </Paper>
    </Container>
  );
}
