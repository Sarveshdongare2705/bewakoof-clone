"use client";

import { facebook, google, hidePassword, loginImg, logoutBut, showPasswordImg } from "../../assets/Assets";
import userStore from "../../store/userStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Login = () => {
  const router = useRouter();
  const login = userStore((state) => state.login);
  const [isLoginDisabled, setIsLoginDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState({ email: "", password: "" });
  const [err, setErr] = useState({
    emailErr: null,
    passwordErr: null,
  });

  const handleLogin = async () => {
    const result = await login(user);
    console.log(result);
    if (result.success === true) {
      router.push("/");
    }
  };
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setUser((prev) => ({ ...prev, email: value }));

    if (value.length === 0) {
      setErr({ ...err, emailErr: "Email is required" });
      setIsLoginDisabled(true);
    } else if (!value.includes("@") || !value.includes(".")) {
      setErr({ ...err, emailErr: "Enter a valid email address" });
      setIsLoginDisabled(true);
    } else {
      setErr({ ...err, emailErr: null });
      if (!err.passwordErr && user.password.length >= 4) {
        setIsLoginDisabled(false);
      }
    }
  };
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setUser((prev) => ({ ...prev, password: value }));

    if (value.length < 4) {
      setErr({ ...err, passwordErr: "Enter a valid password" });
      setIsLoginDisabled(true);
    } else {
      setErr({ ...err, passwordErr: null });
      if (
        !err.emailErr &&
        user.email.includes("@") &&
        user.email.includes(".")
      ) {
        setIsLoginDisabled(false);
      }
    }
  };

  return (
    <div
      className="flexflex-col items-center gap-30 md:flex flex-row"
      style={{ backgroundColor: "#f9f9f9" }}
    >
      <div className="flex-1 md:flex w-full h-full">
        <Image src={loginImg} alt="login-banner" className="h-full w-full" />
      </div>
      <div className="flex-2 md:flex">
        <div className="flex flex-col px-7 py-7">
          <span className="font-bold text-2xl">Login</span>
          <span className="font-normal text-md text-gray-400 ">
            Join us now to be a part of Bewakoof® family.
          </span>
          <div className="max-w-180 min-w-90">
            <input
              type="email"
              value={user.email}
              placeholder="Enter email"
              onChange={handleEmailChange}
              className="input"
            />
            <span className="err">{err.emailErr}</span>
          </div>
          <div className="max-w-180 min-w-90">
            <div className="relative w-full max-w-180">
              <input
                type={showPassword ? "text" : "password"}
                value={user.password}
                placeholder="Enter secure password"
                onChange={handlePasswordChange}
                className="input"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3/5 transform -translate-y-1/2 cursor-pointer text-gray-600"
              >
                {showPassword ? (
                  <Image
                    src={showPasswordImg}
                    alt="login-banner"
                    width={30}
                    height={30}
                  />
                ) : (
                  <Image
                    src={hidePassword}
                    alt="login-banner"
                    width={30}
                    height={30}
                  />
                )}
              </span>
            </div>
            <span className="err">{err.passwordErr}</span>
          </div>
          <button
            style={
              isLoginDisabled
                ? { backgroundColor: "#f0f0f0", color: "f9f9f9" }
                : {}
            }
            className="loginBut"
            onClick={handleLogin}
            disabled={isLoginDisabled}
          >
            Continue
          </button>
          <div className="my-2 flex items-end max-w-180 justify-end">
            <Link
              href={"/register"}
              className="text-sm font-medium text-blue-400"
            >
              Forgot Password
            </Link>
          </div>
          <div className="my-4 flex items-center justify-center gap-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex-1">
              <button className="flex w-full bg-white items-center gap-2 border w-50 border-gray-200 px-4 py-4 cursor-pointer justify-center hover:bg-gray-100 transition">
                <Image src={google} alt="Google" width={20} height={20} />
                <span className="text-sm font-medium">Google</span>
              </button>
            </div>
            <div className="flex-1">
              <button className="flex w-full bg-white items-center gap-2 border w-50 border-gray-200 px-4 py-4 cursor-pointer justify-center hover:bg-gray-100 transition">
                <Image src={facebook} alt="Facebook" width={20} height={20} />
                <span className="text-sm font-medium">Facebook</span>
              </button>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm">Don't have an account ? </span>
            <Link
              href={"/register"}
              className="text-md font-bold text-yellow-400"
            >
              Register
            </Link>
          </div>
          <div className="mt-7 flex justify-center items-center gap-2 text-sm">
            <span>
              By creating an account or logging in, you agree with Bewakoof's{" "}
            </span>
            <Link href={"/login"} className="font-semibold text-blue-500">
              {" T&C "}
            </Link>
            <span> and </span>
            <Link href={"/login"} className="font-semibold text-blue-500">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
