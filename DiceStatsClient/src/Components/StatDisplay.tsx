import * as React from "react";
import { Card } from "@mui/material";
export default function StatDisplay({ children }: any) {
return (
  <Card
    className="stat-display"
    sx={{
      backgroundColor: "#e0e0e0",
      width: {
        md: "100%", // medium screens and up
      },
    }}
  >
    {children}
  </Card>
);
}
