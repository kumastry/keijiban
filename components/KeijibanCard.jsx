import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Link from "next/link";

const newLineStyle = {
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",
};
// key + 1 + (page - 1) * take
const KeijibanCard = ({ id, title, category, description, number }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={newLineStyle}>
          No.{number}
          {" " + title}
        </Typography>

        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          カテゴリー:{category}
        </Typography>

        <Typography variant="body1" sx={newLineStyle}>
          {description}
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          margin: 1,
        }}
      >
        <Link href={`/boards/${id}`}>
          <Button size="large">掲示板を見る</Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default KeijibanCard;
