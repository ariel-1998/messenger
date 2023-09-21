import {
  Stack,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Box,
  Button,
  TextField,
} from "@mui/material";
import React, { SyntheticEvent } from "react";
import { UserModel, userSchema } from "../../models/UserModel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userService } from "../../services/userServices";
import { useMutation } from "@tanstack/react-query";
import { LoadingButton } from "@mui/lab";

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

  const formMutation = useMutation({
    mutationFn: userService.register,
    onError: (err) => console.log(err),
  });

  const imageMutation = useMutation({
    mutationFn: userService.uploadImage,
    onError: (err) => console.log(err), // maybe delete image from db if an error accured
  });

  const onSubmit = (data: UserModel) => {
    imageMutation.mutateAsync(data.image as FileList).then((imgData) => {
      formMutation.mutate({ ...data, image: imgData.url });
    });
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
        <Box>
          <InputLabel>Profile image</InputLabel>
          <Input type="file" {...register("image")} />
          {errors?.image && (
            <FormHelperText>{errors.image.message}</FormHelperText>
          )}
        </Box>
        <Box p={1}>
          <LoadingButton
            variant="contained"
            type="submit"
            loading={imageMutation.isLoading || formMutation.isLoading}
          >
            Register
          </LoadingButton>
          <Button sx={{ ml: 2 }} variant="outlined" type="reset">
            Reset
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default Register;
