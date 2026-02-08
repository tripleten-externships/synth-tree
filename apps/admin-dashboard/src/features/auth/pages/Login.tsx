import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Input,
  toast,
  Toaster,
} from "@skilltree/ui";
import {
  getMultiFactorResolver,
  GoogleAuthProvider,
  type MultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  sendEmailVerification,
  signInWithPopup,
  type UserCredential,
} from "firebase/auth";
import { type SyntheticEvent,useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import useAuth from "../../../hooks/useAuth";
import { auth } from "../../../lib/firebase";
import { GoogleLogo } from "../components/GoogleLogo";

const provider = new GoogleAuthProvider();

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password is too short" }),
});

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [resolver, setResolver] = useState<MultiFactorResolver>();

  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);

  const loginWithCredential = (userCredential: UserCredential) => {
    const { user } = userCredential;
    if (!user.emailVerified) {
      sendEmailVerification(user);
      throw new Error("Please check your email for a verification message");
    }
    return auth.currentUser?.getIdToken().then((token?: string) => {
      if (token === undefined) {
        toast("Failed to login", {
          description: "Check your credentials and try again",
          onAutoClose: () => {
            setIsLoading(false);
            setShowVerificationCode(false);
          },
        });
        return;
      }

      toast("Success!", {
        description: "Logging you in...",
        onAutoClose: () => {
          setIsLoading(false);
          navigate("/dashboard");
        },
      });
    });
  };

  const twofaLogin = () => {
    const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
    resolver
      ?.resolveSignIn(multiFactorAssertion)
      .then(loginWithCredential)
      .catch((error) => {
        toast("Failed to login", {
          description: error.message,
          onAutoClose: () => setIsLoading(false),
        });
      });
  };

  const loginToGoogle = async () => {
    signInWithPopup(auth, provider)
      .then(loginWithCredential)
      .catch((err) => {
        if (err.code == "auth/multi-factor-auth-required") {
          const resolver = getMultiFactorResolver(auth, err);
          const phoneInfoOptions = {
            multiFactorHint: resolver.hints[0],
            session: resolver.session,
          };
          const phoneAuthProvider = new PhoneAuthProvider(auth);
          phoneAuthProvider
            .verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier!)
            .then((verificationId) => {
              setResolver(resolver);
              setVerificationId(verificationId);
              setShowVerificationCode(true);
            });
        } else {
          throw err;
        }
      });
  };

  const onGoogleClick = (e: SyntheticEvent) => {
    e.preventDefault();

    setIsLoading(true);
    loginToGoogle()
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        toast("Failed to login", {
          description: String(err.message),
          onAutoClose: () => setIsLoading(false),
        });
      });
  };

  const loginWithPassword = async (data: LoginFormInputs) => {
    login(data.email, data.password)
      .then(loginWithCredential)
      .catch((err) => {
        if (err.code == "auth/multi-factor-auth-required") {
          const resolver = getMultiFactorResolver(auth, err);
          const phoneInfoOptions = {
            multiFactorHint: resolver.hints[0],
            session: resolver.session,
          };
          const phoneAuthProvider = new PhoneAuthProvider(auth);
          phoneAuthProvider
            .verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier!)
            .then((verificationId) => {
              setResolver(resolver);
              setVerificationId(verificationId);
              setShowVerificationCode(true);
            });
        } else {
          throw err;
        }
      });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    if (showVerificationCode) {
      twofaLogin();
    } else {
      setIsLoading(true);
      loginWithPassword(data)
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          toast("Failed to login", {
            description: String(err.message),
            onAutoClose: () => setIsLoading(false),
          });
        });
    }
  };

  useEffect(() => {
    setRecaptchaVerifier(
      new RecaptchaVerifier(auth, "recaptcha-container-id", {
        size: "invisible",
        callback: function () {
          //console.log(response);
        },
      })
    );
  }, []);

  return (
    <form
      className="max-w-lg w-full mx-auto my-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Toaster position="top-center" />
      <Card>
        <CardHeader>Logo Goes Here</CardHeader>
        <CardContent className="space-y-6">
          {!showVerificationCode ? (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Email Address
                </label>
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

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div>
              <label className="text-sm font-medium mb-2 block">
                Verification Code
              </label>
              <Input
                type="password"
                placeholder="Enter two-factor verification code"
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex flex-col gap-2 w-full">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {showVerificationCode ? "Submit" : "Login"}
            </Button>
            {!showVerificationCode && (
              <Button
                variant="outline"
                leftIcon={<GoogleLogo />}
                onClick={onGoogleClick}
                disabled={isLoading}
              >
                Sign in with Google
              </Button>
            )}
            <Button variant="ghost">Forgot Password</Button>
          </div>
        </CardFooter>
      </Card>
      <div id="recaptcha-container-id" />
    </form>
  );
}
