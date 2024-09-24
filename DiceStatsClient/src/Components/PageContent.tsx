import * as React from "react";
import { Paper, Container } from "@mui/material";

export default function PageContent({ children }: any) {
  return (
    <Container disableGutters>
      <Paper
        className="page-content"
        sx={{
          backgroundColor: "#333333",
          color: "#e0e0e0", 
        }}
      >{children}</Paper>
    </Container>
  );
}
