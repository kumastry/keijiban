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

//TODO:リファクタリング
//- ビューとロジックを分ける
//- 変数名を考える　→　具体的な処理の変数名
//- 理解しにくいコードを見つける
//- 抽象化する
//- 使わないコードをコメントアウトする
// jsxはセマンティックにする

export default function post_keijiban() {
  const { data: session, status } = useSession();
  const { control, handleSubmit } = useForm({
    defaultValues: { title: "", category: "", description: "" },
  });

  //なんのopen?
  //掲示板を投稿したときのフィードバックのためのsnackbarのopen
  const [open, setOpen] = useState(true);

  //使わないならコメントアウトしようね
  /*今は使わない、将来使うカモ
  const inputRef = useRef(null);
  const [inputError, setInputError] = useState(false);
  */

  //バリデーションは外に出そうね
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

  /*const handleChange = () => {
    if (inputRef.current) {
      const ref = inputRef.current;
      if (!ref.validity.valid) {
        setInputError(true);
      } else {
        setInputError(false);
      }
    }
  };*/

  //
  const router = useRouter();

  //console.log(session);
  //console.log(status);

  //postkeijiban分かりにくい
  //入力したデータをpostする処理
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
                    style={{ width: "35%" }}
                    error={fieldState.invalid}
                  >

                    {/*ここ繰り返さない 抽象化できる*/}
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
    props: {}, 
  };
}
