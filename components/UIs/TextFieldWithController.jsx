import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

const TextFieldWithController = ({ control, validationRules, label }) => {
  return (
    <Controller
      name="title"
      control={control}
      rules={validationRules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          required
          id="standard-required"
          label={label}
          variant="standard"
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
};

export default TextFieldWithController;
