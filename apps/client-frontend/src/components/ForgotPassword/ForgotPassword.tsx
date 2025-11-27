import React, { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "react-hook-form";
import axios from "axios";

interface FormType {
  email: string;
  password?: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>();

  const submitHandler = async ({ email }: FormType) => {
    setLoading(true);
    try {
      await axios
        .post("api/auth/forgotPassword", { email: email })
        .then((res: any) => {
          const response = res.data;

          // TO-DO: Make sure these conditions are both correct and reusable
          if (response.status === 200) {
            console.log(response.message);
            setLoading(false);
          } else if (response.status === 400) {
            console.log(response.message);
            setLoading(false);
          } else if (response.status === 500) {
            console.log(response.message);
            setLoading(false);
          }
        });
    } catch (err) {
      setLoading(false);
      console.log("This err is ", err);
    }
  };

  return (
    <>
      <form>
        {/* Email */}
        <label>Email</label>
        <input
          type="email"
          placeholder="example@email.com"
          {...register("email", {
            required: "Please enter a valid email",
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
              message: "Please use a valid email format ",
            },
          })}
        />
        Email
        {errors.email && (
          <div className="text-red-600">{errors.email.message}</div>
        )}
        {/* Submit */}
        <button type="submit">Submit</button>
        {/* Loading Effect */}
        <button
          className="w-full bg-gray-500 hover:bg-gray-700 p-2 rounded-sm text-white"
          disabled={loading}
        >
          {loading ? "Processing" : "Send"}
        </button>
      </form>
    </>
  );
};

export default ForgotPassword;
