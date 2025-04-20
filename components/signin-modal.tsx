"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginForm } from "@/hooks/formValidation";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { userStore } from "@/stores/userStore";
import { useState } from "react";
import axios from "axios";

interface SignInModalProps {
  onClose: () => void;
}

export function SignInModal({ onClose }: SignInModalProps) {
  const { setUser } = userStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useLoginForm();
  const [loading, setLoading] = useState(false);

  const submitForm = (data: any) => {
    setLoading(true);
    const handleLogin = async () => {
      try {
        const res = await axios.post("/api/auth", {
          email: data.email,
          password: data.password,
        });
        setUser(res.data.userDetails);
        toast("Login Successful!", {
          style: {
            backgroundColor: "white",
            color: "green",
            textAlign: "center",
          },
        });
        onClose();
      } catch (err) {
        toast("Wrong Password", {
          style: {
            backgroundColor: "white",
            color: "red",
            textAlign: "center",
          },
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    handleLogin();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-lg relative">
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
        <h1 className="font-serif text-2xl font-semibold text-center text-[#2D2A26] mb-4">
          Sign in to RecipeVerse
        </h1>
        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              {...register("email")}
              className="border-[#E8E2D9] focus-visible:ring-[#6B8068]"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              {...register("password")}
              className="border-[#E8E2D9] focus-visible:ring-[#6B8068]"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-[#6B8068] hover:bg-[#5A6B58]"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin" /> : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
