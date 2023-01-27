import styles from "../styles/Home.module.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { MenuItem } from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Button from "@mui/material/Button";
import axios from "axios";
import { useSession } from "next-auth/react";
import Stack from "@mui/material/Stack";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import { useState, useRef } from "react";

export default function post_keijiban() {
  const { data: session, status } = useSession();
  const { control, handleSubmit } = useForm({
    defaultValues: { title: "", category: "", description: "" },
  });
  const [open, setOpen] = useState(true);

  const inputRef = useRef(null);
  const [inputError, setInputError] = useState(false);

  const validationRules = {
    title: {
      required: "掲示板名を入力してください。",
      maxLength: { value: 200, message: "200文字以下で入力してください。" },
      minLength: { value: 0, message: "掲示板名を入力してください" },
    },
    description: {
      required: "掲示板の概要を入力してください。",
      maxLength: { value: 400, message: "400文字以下で入力してください。" },
      minLength: { value: 0, message: "掲示板名を入力してください" },
    },
  };

  const handleChange = () => {
    if (inputRef.current) {
      const ref = inputRef.current;
      if (!ref.validity.valid) {
        setInputError(true);
      } else {
        setInputError(false);
      }
    }
  };

  const router = useRouter();

  //console.log(session);
  //console.log(status);

  const postKeijiban = async (data) => {
    //console.log(data);
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
              <Controller
                name="title"
                control={control}
                rules={validationRules.title}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    required
                    id="standard-required"
                    label="掲示板名"
                    variant="standard"
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="category"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    id="standard-select-currency"
                    {...field}
                    required
                    select
                    label="カテゴリー"
                    helperText={fieldState.error?.message}
                    variant="standard"
                    style={{ width: "40%" }}
                    error={fieldState.invalid}
                  >
                    <MenuItem value="ニュース">ニュース</MenuItem>
                    <MenuItem value="日常">日常</MenuItem>
                    <MenuItem value="学習">学習</MenuItem>
                    <MenuItem value="相談">相談</MenuItem>
                    <MenuItem value="ペット">ペット</MenuItem>
                    <MenuItem value="その他">その他</MenuItem>
                  </TextField>
                )}
              />

              <Controller
                name="description"
                control={control}
                rules={validationRules.description}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    required
                    id="standard-required"
                    label="掲示板の概要"
                    multiline
                    rows={6}
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              {/* <TextField
                id="standard-select-currency"
                required
                select
                label="カテゴリー"
                helperText="カテゴリーを選択"
                variant="standard"
                style={{ width: "30%" }}
                {...control("category")}
              >
                <MenuItem value="ニュース">ニュース</MenuItem>
                <MenuItem value="日常">日常</MenuItem>
                <MenuItem value="学習">学習</MenuItem>
                <MenuItem value="相談">相談</MenuItem>
                <MenuItem value="ペット">ペット</MenuItem>
                <MenuItem value="その他">その他</MenuItem>
              </TextField>

              <TextField
                id="outlined-multiline-static"
                label="掲示板の概要"
                required
                multiline
                inputProps={{ maxLength: 400}}
                fullWidth
                rows={6}
                {...control("description")}
              /> */}

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
