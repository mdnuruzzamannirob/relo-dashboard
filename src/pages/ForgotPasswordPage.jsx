import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForgotPasswordMutation } from "../services/allApi";
import Text from "../components/Text";
import Inputbox from "../components/InputBox";
import Button from "../components/Button";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      await forgotPassword({ email }).unwrap();
      navigate("/verifyCode", { state: { email: email } });
      toast.success("Verification code sent to your email!");
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-150">
        <Text text={"Forgot Password ?"} />

        <form onSubmit={handleSubmit}>
          <Inputbox
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            handleSubmit={handleSubmit}
            buttonText={"Send Code"}
            loading={isLoading} // Pass the API loading state here
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
