import { useNavigate } from "react-router-dom";
import { IconButton, Container } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";

export default function BackButtonContainer({route}: any) {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(route);
  };
  return (
    <Container sx={{display: "flex", justifyContent:"flex-start"}}>
      <IconButton onClick={handleBackClick} color="primary" aria-label="back">
        <ArrowBack />
      </IconButton>
    </Container>
  );
}
