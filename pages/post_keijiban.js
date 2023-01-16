import styles from "../styles/Home.module.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { MenuItem } from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Button from "@mui/material/Button";
import axios from "axios";
import { useSession } from "next-auth/react";
import Stack from '@mui/material/Stack';


export default function post_keijiban() {
  const { data: session, status } = useSession();

  console.log(session);
  console.log(status);

  const postKeijiban = () => {
    axios.post("api/boards", {
      title: "三郎",
      category: "田中",
      description: "momo",
      userId: session.user.id,
    });
  };
  return (
    <>
      <main className={styles.main}>
        <Box sx={{ width: '75%' }}>
        <Stack spacing={5}>
        <TextField
          required
          id="standard-required"
          label="掲示板名"
          variant="standard"
        />

        
        <TextField
          id="standard-select-currency"
          select
          label="カテゴリー"
          helperText="カテゴリーを選択"
          variant="standard"
          style = {{width: "30%"}}
        >
          <MenuItem>あああ</MenuItem>
          <MenuItem>あああ</MenuItem>
          <MenuItem>あああ</MenuItem>
          <MenuItem>あああ</MenuItem>
        </TextField>

        <TextField
          id="outlined-multiline-static"
          label="掲示板の概要"
          multiline
          fullWidth
          rows={6}
          
        />

        <Button
          variant="contained"
          endIcon={<PostAddIcon />}
          onClick={postKeijiban}
        >
          掲示板を投稿
        </Button>

        </Stack>
        </Box>
      </main>
    </>
  );
}

export async function getStaticProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
