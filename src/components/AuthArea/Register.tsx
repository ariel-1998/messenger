import {
  Stack,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Box,
  Button,
} from "@mui/material";
import React from "react";
import { UserModel, userSchema } from "../../models/UserModel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserModel>({
    resolver: zodResolver(
      userSchema.refine((obj) => obj.password === obj.confirmPassword, {
        message: "Passwords do not match",
        path: ["password"],
      })
    ),
  });

  const onSubmit = async (data: UserModel) => {
    alert("success");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <FormControl margin="dense">
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input id="name" type="text" {...register("name")} />
          {errors?.name && (
            <FormHelperText>{errors?.name?.message}</FormHelperText>
          )}
        </FormControl>
        <FormControl margin="dense">
          <InputLabel htmlFor="email">Email address</InputLabel>
          <Input id="email" type="text" {...register("email")} />
          {errors?.email && (
            <FormHelperText>{errors.email.message}</FormHelperText>
          )}
        </FormControl>
        <FormControl margin="dense">
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input id="password" type="password" {...register("password")} />
          {errors?.password && (
            <FormHelperText>{errors.password.message}</FormHelperText>
          )}
        </FormControl>
        <FormControl margin="dense">
          <InputLabel htmlFor="confirmPassword">Confirm password</InputLabel>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
          />
          {errors?.confirmPassword && (
            <FormHelperText>{errors.confirmPassword.message}</FormHelperText>
          )}
        </FormControl>
        {/* add input tipe file */}
        <Box p={1}>
          <Button variant="contained" type="submit">
            Register
          </Button>
          <Button sx={{ ml: 2 }} variant="outlined" type="reset">
            Reset
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default Register;
