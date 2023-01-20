import styles from "../styles/Home.module.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { MenuItem } from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Button from "@mui/material/Button";
import axios from "axios";
import { useSession } from "next-auth/react";
import Stack from "@mui/material/Stack";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import Snackbar from '@mui/material/Snackbar';
import { useState } from "react";

export default function post_keijiban() {
  const { data: session, status } = useSession();
  const { register, handleSubmit } = useForm();
  const [open, setOpen] = useState(true);
  
  const router = useRouter();

  console.log(session);
  console.log(status);

  const postKeijiban = async (data) => {
    console.log(data);
    const { title, category, description } = data;
    //console.log(title);
    //console.log(category);
    //console.log(description);

    setOpen(!open);
    await axios.post("api/boards", {
      title,
      category,
      description,
      userId: session.user.id,
    });
    
    router.push("..");
    
  };
  return (
    <>
      <main className={styles.main}>
        <Box sx={{ width: "75%" }}>
          <form method="post" onSubmit={handleSubmit(postKeijiban)}>
            <Stack spacing={5}>
              <TextField
                required
                id="standard-required"
                label="掲示板名"
                variant="standard"
                {...register("title")}
              />

              <TextField
                id="standard-select-currency"
                select
                label="カテゴリー"
                helperText="カテゴリーを選択"
                variant="standard"
                style={{ width: "30%" }}
                {...register("category")}
              >
                <MenuItem value="aaa">あああ</MenuItem>
                <MenuItem value="aaa">あああ</MenuItem>
                <MenuItem value="aaa">あああ</MenuItem>
                <MenuItem value="aaa">あああ</MenuItem>
              </TextField>

              <TextField
                id="outlined-multiline-static"
                label="掲示板の概要"
                multiline
                fullWidth
                rows={6}
                {...register("description")}
              />

              <Button
                type="submit"
                variant="contained"
                endIcon={<PostAddIcon />}
              >
                掲示板を投稿
              </Button>
            </Stack>
          </form>
        </Box>

        <Snackbar
        open={!open}
        autoHideDuration={6000}
        message="掲示板を投稿しました"
      />
      </main>
    </>
  );
}

export async function getStaticProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
