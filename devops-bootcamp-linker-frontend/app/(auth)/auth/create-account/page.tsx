"use client";

import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";

export default function CreateAccount() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm<FieldValues>({ mode: "all" });
  const password = watch("password");

  const onSubmit = async (data: FieldValues) => {
    setIsPending(true);
    try {
      const ok = await registerUser(data.email, data.password);
      if (ok) {
        toast.success("Account created! Welcome.");
        router.push("/link");
      } else {
        toast.error("Error creating account. Try a different email.");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} method="POST">
        <div>
          <h1 className="text-[32px] font-bold">Create account</h1>
          <p className="text-gray-500 mt-1">Let’s get you started sharing your links!</p>
        </div>
        <div className="flex flex-col gap-6 mt-10">
          <div>
            <label htmlFor="email" className={`text-xs mb-2 ${errors?.email ? "text-destructive" : ""}`}>
              Email address
            </label>
            <div className="relative">
              <input
                {...register("email", {
                  required: "Can't be empty",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                id="email"
                className={`w-full py-3 pl-10 pr-[105px] border ${errors?.email ? "border-destructive" : "border-neutral-300"} outline-none rounded-lg focus:shadow-purpleShadow focus:outline-[1px] focus:outline-offset-0 focus:outline-neutral-300`}
                placeholder="e.g. alex@email.com"
              />
              <Image src="/assets/icons/envelope.svg" className="absolute top-1/2 left-4 -translate-y-1/2" width={16} height={16} alt="" />
              {errors?.email && (
                <p className="absolute top-1/2 right-4 -translate-y-1/2 text-destructive text-xs">{errors?.email.message as string}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="password" className={`text-xs mb-2 ${errors?.password ? "text-destructive" : ""}`}>
              Create password
            </label>
            <div className="relative">
              <input
                {...register("password", {
                  required: "Can't be empty",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                })}
                type="password"
                id="password"
                className={`w-full py-3 px-10 pr-[105px] border ${errors?.password ? "border-destructive" : "border-neutral-300"} outline-none rounded-lg focus:shadow-purpleShadow focus:outline-[1px] focus:outline-offset-0 focus:outline-neutral-300`}
                placeholder="At least 8 characters"
              />
              <Image src="/assets/icons/lock.svg" className="absolute top-1/2 left-4 -translate-y-1/2" width={16} height={16} alt="" />
              {errors?.password && (
                <p className="absolute top-1/2 right-4 -translate-y-1/2 text-destructive text-xs">{errors?.password.message as string}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className={`text-xs mb-2 ${errors?.confirmPassword ? "text-destructive" : ""}`}>
              Confirm password
            </label>
            <div className="relative">
              <input
                {...register("confirmPassword", {
                  required: "Can't be empty",
                  validate: (value) => value === password || "Passwords do not match",
                })}
                type="password"
                id="confirmPassword"
                className={`w-full py-3 px-10 pr-[105px] border ${errors?.confirmPassword ? "border-destructive" : "border-neutral-300"} outline-none rounded-lg focus:shadow-purpleShadow focus:outline-[1px] focus:outline-offset-0 focus:outline-neutral-300`}
                placeholder="At least 8 characters"
              />
              <Image src="/assets/icons/lock.svg" className="absolute top-1/2 left-4 -translate-y-1/2" width={16} height={16} alt="" />
              {errors?.confirmPassword && (
                <p className="absolute top-1/2 right-4 -translate-y-1/2 text-destructive text-xs">{errors?.confirmPassword.message as string}</p>
              )}
            </div>
          </div>
          <div>
            <Button type="submit" disabled={!isValid || isPending}>
              {isPending ? <ClipLoader color="white" size={18} /> : " Create new account"}
            </Button>
          </div>
          <p className="text-gray-500 text-center">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-secondary hover:text-secondary/80">
              Login
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
