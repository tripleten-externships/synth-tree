import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Input,
} from "@synth-tree/ui";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../lib/firebase";

const emailSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});

export function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<{ email: string }>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, data.email);
    } catch (e) {
      console.error(e);
    }

    setDone(true);
    setIsLoading(false);
  };

  if (done) {
    const email = getValues("email");

    return (
      <div className="max-w-lg w-full mx-auto my-auto">
        <Card>
          <CardHeader>Reset link sent</CardHeader>
          <CardContent>
            <p className="text-sm">
              We sent a reset link to <b>{email}</b>. Check your inbox.
            </p>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col gap-2 w-full">
              <Button
                className="w-full"
                type="button"
                onClick={() => {
                  window.location.href = "/auth/login";
                }}
              >
                Back to login
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <form
      className="max-w-lg w-full mx-auto my-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Card>
        <CardHeader>Forgot Password</CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Enter your email to get a reset link.
          </p>
          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <Input
              type="email"
              placeholder="john.doe@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col gap-2 w-full">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Submit"}
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={() => navigate("/auth/login")}
            >
              back to login
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
