import { SubmitHandler, useForm, Controller } from "react-hook-form";

//defautltValusesはオブジェクト型
//例:{string: string, string:string}
const useFormValidation = (defaultValues, validationRule) => {
  //validationルールを選択できるようにする
  //使うバリデーションルールをフィールドから選択する方式でok?
  //外部ファイルからimportするのもあり
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
    comment: {
      required: "コメントを入力してください。",
      maxLength: { value: 600, message: "600文字以下で入力してください。" },
      minLength: { value: 0, message: "コメントを入力してください" },
    },
  };

  const { control, handleSubmit } = useForm({ defaultValues });
  return { control, handleSubmit, validationRules };
};

export default useFormValidation;
