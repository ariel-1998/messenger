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
import { authService } from "../../services/authService";
import { toastifyService } from "../../services/toastifyService";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialsModel>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: authService.login,
    onError: (err) => toastifyService.error(err),
    onSuccess: () => navigate("/chat"),
  });

  const onSubmit = async (data: CredentialsModel) => {
    mutate(data);
  };

  return (
    <form role="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <FormControl margin="dense" data-testid="form-control">
          <InputLabel htmlFor="email">Email address</InputLabel>
          <Input id="email" type="text" {...register("email")} />
          {errors?.email && (
            <FormHelperText data-testid="error-message">
              {errors.email.message}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl margin="dense" data-testid="form-control">
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input id="password" type="password" {...register("password")} />
          {errors?.password && (
            <FormHelperText data-testid="error-message">
              {errors.password.message}
            </FormHelperText>
          )}
        </FormControl>
        <Box p={1}>
          <LoadingButton variant="contained" type="submit" loading={isLoading}>
            Login
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
