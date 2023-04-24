//styles imports
import styles from "../styles/Home.module.css";

//hooks imports
import { Controller } from "react-hook-form";
import useFormValidation from "../hooks/useFormValidation";
import useCreateKeijibanHandler from "../hooks/useCreateKeijibanHandler";

//MUI imports
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";

//TODO:リファクタリング
//- ビューとロジックを分ける
//- 変数名を考える　→　具体的な処理の変数名
//- 理解しにくいコードを見つける
//- 抽象化する
//- 使わないコードをコメントアウトする
// jsxはセマンティックにする

//useFormとvalidationRulesは一体化できる
//このformと掲示板コメント投稿のformは一体化できるかも
//useRouterとpostkeijibanは押したときの処理として共通化できる
//またコメント投稿でも同じことできるかも
//postkeijiban分かりにくい
//ハンドラーと分かるように変数名を付ける
//入力したデータをpostする処理
//なんのopen?(抽象的すぎる) → 関数を具体的にする
//掲示板を投稿したときのフィードバックのためのsnackbarのopen
//使わないならコメントアウトしようね
//今は使わない、将来使うカモ
//バリデーションは外に出そうね
//セッションがないとリダイレクトする必要がある

export default function post_keijiban({session}) {
 
  
  const { control, handleSubmit, validationRules } = useFormValidation({
    title: "",
    category: "",
    description: "",
  });
  const { postKeijiban, isSnackbarOpen } = useCreateKeijibanHandler({session});

  return (
    <>
      <main className={styles.main}>
        <Box sx={{ width: "75%" }}>
          <form method="post" onSubmit={handleSubmit(postKeijiban)}>
            <Stack spacing={5}>
              {/*コントローラは共通化できる？*/}
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
                    {/*ここ繰り返さない抽象化できる 最終的に管理者が追加できるようにする*/}
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
          open={isSnackbarOpen}
          autoHideDuration={6000}
          message="掲示板を投稿しました"
        />
      </main>
    </>
  );
}

post_keijiban.auth = true;
export async function getStaticProps(context) {
  return {
    props: {},
  };
}
