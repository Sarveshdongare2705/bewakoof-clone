"use client";

import {
  hidePassword,
  india,
  loginImg,
  showPasswordImg,
} from "../../assets/Assets";
import userStore from "../../store/userStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Register = () => {
  const router = useRouter();
  const signup = userStore((state) => state.signup);
  const [isSingupDisabled, setIsSignupDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
    phoneNo: "",
    gender: "",
    birthDate: "",
  });

  const [err, setErr] = useState({
    userNameErr: null,
    emailErr: null,
    passwordErr: null,
    phoneNoErr: null,
    genderErr: null,
    birthDateErr: null,
  });

  const handleSignup = async () => {
  const formattedUser = {
    ...user,
    phoneNo: user.phoneNo.startsWith("+91") ? user.phoneNo : `+91${user.phoneNo}`,
  };
  const result = await signup(formattedUser);
  console.log(result);
  if (result.success === true) {
    router.push("/");
  }
};


  const isSignupAllowed = () => {
    if (
      user.userName.length !== 0 &&
      user.email.length !== 0 &&
      user.password.length !== 0 &&
      user.gender.length !== 0 &&
      user.birthDate.length !== 0 &&
      user.phoneNo.length !== 0 &&
      err.userNameErr == null &&
      err.emailErr == null &&
      err.passwordErr == null &&
      err.birthDateErr == null &&
      err.genderErr == null &&
      err.phoneNoErr == null
    ) {
      setIsSignupDisabled(false);
    } else {
      setIsSignupDisabled(true);
    }
  };
  useEffect(() => {
    isSignupAllowed();
  }, [user]);
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setUser((prev) => ({ ...prev, email: value }));

    if (value.length === 0) {
      setErr({ ...err, emailErr: "Email is required" });
      setIsLoginDisabled(true);
    } else if (!value.includes("@") || !value.includes(".")) {
      setErr({ ...err, emailErr: "Enter a valid email address" });
    } else {
      setErr({ ...err, emailErr: null });
    }
  };
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setUser((prev) => ({ ...prev, password: value }));

    if (value.length < 4) {
      setErr({ ...err, passwordErr: "Enter a valid password" });
    } else {
      setErr({ ...err, passwordErr: null });
    }
  };
  const handleUserNameChange = (e) => {
    const value = e.target.value;
    setUser((prev) => ({ ...prev, userName: value }));

    if (user.userName.length < 6 || user.userName.length > 20) {
      setErr({ ...err, userNameErr: "Enter a valid username" });
    } else {
      setErr({ ...err, userNameErr: null });
    }
  };
  const handlePhoneNoChange = (e) => {
    const value = e.target.value;
    setUser((prev) => ({ ...prev, phoneNo: value }));

    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(value)) {
      setErr((prev) => ({
        ...prev,
        phoneNoErr: "Enter a valid 10-digit phone number",
      }));
    } else {
      setErr((prev) => ({ ...prev, phoneNoErr: null }));
    }
  };
  const handleGenderChange = (e) => {
    const value = e.target.value;
    setUser((prev) => ({ ...prev, gender: value }));

    if (
      user.gender === "Male" ||
      user.gender === "Female" ||
      user.gender === "Other"
    ) {
      setErr({ ...err, genderErr: null });
    } else {
      setErr({ ...err, genderErr: "Select a valid gender" });
    }
  };
  const handleBirthDateChange = (e) => {
    const value = e.target.value; // e.g., "2005-06-15"
    setUser((prev) => ({ ...prev, birthDate: value }));

    const selectedDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    const dayDiff = today.getDate() - selectedDate.getDate();
    const isBirthdayPassedThisYear =
      monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0);
    const realAge = isBirthdayPassedThisYear ? age : age - 1;

    if (!value) {
      setErr({ ...err, birthDateErr: "Birthdate is required" });
    } else if (selectedDate > today) {
      setErr({ ...err, birthDateErr: "Birthdate cannot be in the future" });
    } else if (realAge < 13) {
      setErr({ ...err, birthDateErr: "You must be at least 13 years old" });
    } else {
      setErr({ ...err, birthDateErr: null });
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
          <span className="font-bold text-2xl">Signup</span>
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
          <div className="mmax-w-180 min-w-90 flex gap-2">
            <div className="flex-1">
              <select
                value={user.gender}
                onChange={handleGenderChange}
                className="input"
              >
                <option value="" className="select">
                  Select Gender
                </option>
                <option value="Male" className="select">
                  Male
                </option>
                <option value="Female" className="select">
                  Female
                </option>
                <option value="Other" className="select">
                  Other
                </option>
              </select>

              <span className="err">{err.genderErr}</span>
            </div>
            <div className="flex-1">
              <input
                type="date"
                value={user.birthDate}
                placeholder="Select BirthDate"
                onChange={handleBirthDateChange}
                className="input"
              />
              <span className="err">{err.birthDateErr}</span>
            </div>
          </div>
          <div className="max-w-180 min-w-90">
            <input
              type="text"
              value={user.userName}
              placeholder="Enter your username"
              onChange={handleUserNameChange}
              className="input"
            />
            <span className="err">{err.userNameErr}</span>
          </div>
          <div className="max-w-180 min-w-90">
            <div className="input flex items-center border border-gray-300 rounded-md bg-white px-3 py-2">
              <Image
                src={india}
                alt="India Flag"
                width={24}
                height={24}
                className="mr-2"
              />
              <span className="text-sm text-gray-600 mr-2">+91</span>
              <input
                type="text"
                value={user.phoneNo}
                placeholder="Enter your phone no."
                onChange={handlePhoneNoChange}
                className="w-full outline-none bg-transparent text-sm"
              />
            </div>
            <span className="err">{err.phoneNoErr}</span>
          </div>

          <button
            style={
              isSingupDisabled
                ? { backgroundColor: "#f0f0f0", color: "f9f9f9" }
                : {}
            }
            className="loginBut"
            onClick={handleSignup}
            disabled={isSingupDisabled}
          >
            Continue
          </button>
          <div className="mt-4">
            <span className="text-sm">Already have an account ? </span>
            <Link href={"/login"} className="text-md font-bold text-yellow-400">
              Login
            </Link>
          </div>
          <div className="mt-7 flex justify-center items-center gap-2 text-sm">
            <span>
              By creating an account or logging in, you agree with Bewakoof's{" "}
            </span>
            <Link href={"/register"} className="font-semibold text-blue-500">
              {" T&C "}
            </Link>
            <span> and </span>
            <Link href={"/register"} className="font-semibold text-blue-500">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
