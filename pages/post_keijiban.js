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

import useFormValidation from "../hooks/useFormValidation";
import useCreateKeijibanHandler from "../hooks/useCreateKeijibanHandler";
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

export default function post_keijiban() {
  //セッションがないとリダイレクトする必要がある
  //const { data: session} = useSession();

  const {control, handleSubmit, validationRules} =
  useFormValidation({ title: "", category: "", description: "" });
  const {postKeijiban, isSnackbarOpen} = useCreateKeijibanHandler();

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
          open={isSnackbarOpen}
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
