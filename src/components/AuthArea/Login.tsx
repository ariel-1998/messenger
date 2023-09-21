import { LoadingButton } from "@mui/lab";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { CredentialsModel, loginSchema } from "../../models/UserModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { userService } from "../../services/userServices";

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialsModel>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: userService.login,
    onError: (err) => console.log(err),
  });

  const onSubmit = async (data: CredentialsModel) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <FormControl margin="dense" required>
          <InputLabel htmlFor="email">Email address</InputLabel>
          <Input id="email" type="email" {...register("email")} />
          {errors?.email && (
            <FormHelperText>{errors.email.message}</FormHelperText>
          )}
        </FormControl>
        <FormControl margin="dense" required>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input id="password" type="password" {...register("password")} />
          {errors?.password && (
            <FormHelperText>{errors.password.message}</FormHelperText>
          )}
        </FormControl>
        <Box p={1}>
          <LoadingButton
            variant="contained"
            type="submit"
            loading={loginMutation.isLoading}
          >
            {!loginMutation.isLoading ? "Login" : "Loading"}
          </LoadingButton>
          <Button sx={{ ml: 2 }} variant="outlined" type="reset">
            Reset
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default Login;
