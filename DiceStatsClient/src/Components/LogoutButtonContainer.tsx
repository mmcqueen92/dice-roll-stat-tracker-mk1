import { Button, Container } from "@mui/material";
import { useAuth } from "../Contexts/AuthContext";

export default function LogoutButtonContainer() {
    const { logout } = useAuth();
  return (
    <Container sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button onClick={logout} variant="contained" color="primary">
        Logout
      </Button>
    </Container>
  );
}
