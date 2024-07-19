"use client";
import React, { useState } from "react";
import bcrypt from "bcryptjs";

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitError, setSubmitError] = useState("");

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const idCheck = (id: string) => {
    if (id === "") return "값을 입력해주세요.";
    if (id.length < 5) return "최소 5자 이상 입력해주세요.";
    if (id.length > 15) return "최대 15자 이하로 입력해주세요.";
    return "";
  };
  const nameCheck = (name: string) => {
    if (name === "") return "값을 입력해주세요.";
    return "";
  };
  const passwordCheck = (password: string, confirmPassword: string) => {
    if (password === "") return "값을 입력해주세요.";
    if (password.length < 8) return "최소 8자 이상 입력해주세요.";
    if (password.length > 20) return "최대 20자 이하로 입력해주세요.";
    if (password !== confirmPassword) return "비밀번호가 일치하지 않습니다.";
    return "";
  };
  const confirmPasswordCheck = (confirmPassword: string) => {
    if (confirmPassword === "") return "값을 입력해주세요.";
    if (confirmPassword.length < 8) return "최소 8자 이상 입력해주세요.";
    if (confirmPassword.length > 20) return "최대 20자 이하로 입력해주세요.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let submit = true;

    setError({
      id: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    const { id, name, email, password, confirmPassword } = formData;

    const idError = idCheck(id);
    const nameError = nameCheck(name);
    const passwordError = passwordCheck(password, confirmPassword);
    const confirmPasswordError = confirmPasswordCheck(confirmPassword);

    if (idError || nameError) {
      setError((prev) => ({
        ...prev,
        id: idError,
        name: nameError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      }));
      submit = false;
    }

    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i.test(email)) {
      setError((prev) => ({
        ...prev,
        email: "이메일 형식에 맞게 입력해주세요.",
      }));
      submit = false;
    }

    if (
      !/^[a-zA-Z0-9]*$/.test(password) ||
      !/^[a-zA-Z0-9]*$/.test(confirmPassword)
    ) {
      setError((prev) => ({
        ...prev,
        email: "영문과 숫자만 입력해주세요.",
      }));
      submit = false;
    }

    if (submit) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = {
        id,
        name,
        email,
        password,
        hashedPassword,
      };

      if (localStorage.getItem("users")) {
        const datas = JSON.parse(
          localStorage.getItem("users") || "[]"
        ) as any[];
        const find = datas.findIndex((data) => data.email === email);

        if (find > -1) {
          return setSubmitError("이미 존재하는 이메일입니다.");
        } else {
          localStorage.setItem("users", JSON.stringify([...datas, user]));
        }
      } else {
        localStorage.setItem("users", JSON.stringify([user]));
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4">
        <div>
          <label htmlFor="id" className="block">
            ID:
          </label>
          <input
            className="h-8 border"
            id="id"
            value={formData.id}
            onChange={inputChangeHandler}
          />
          {error.id && (
            <p className="block text-red-500 font-medium">{error.id}</p>
          )}
        </div>
        <div className="mt-4">
          <label htmlFor="name" className="block">
            Name:
          </label>
          <input
            className="h-8 border"
            id="name"
            value={formData.name}
            onChange={inputChangeHandler}
          />
          {error.name && (
            <p className="block text-red-500 font-medium">{error.name}</p>
          )}
        </div>
        <div className="mt-4">
          <label htmlFor="email" className="block">
            Email:
          </label>
          <input
            className="h-8 border"
            id="email"
            value={formData.email}
            onChange={inputChangeHandler}
          />
          {error.email && (
            <p className="block text-red-500 font-medium">{error.email}</p>
          )}
        </div>
        <div className="mt-4">
          <label htmlFor="password" className="block">
            Password:
          </label>
          <input
            className="h-8 border"
            id="password"
            value={formData.password}
            onChange={inputChangeHandler}
            type="password"
          />
          {error.password && (
            <p className="block text-red-500 font-medium">{error.password}</p>
          )}
        </div>
        <div className="mt-4">
          <label htmlFor="confirmPassword" className="block">
            Confirm Password:
          </label>
          <input
            className="h-8 border"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={inputChangeHandler}
            type="password"
          />
          {error.confirmPassword && (
            <p className="block text-red-500 font-medium">
              {error.confirmPassword}
            </p>
          )}
        </div>
        <button type="submit" className="w-20 h-9 bg-black text-white mt-5">
          Submit
        </button>
      </form>
      <p>{submitError}</p>
    </>
  );
};

export default SignupForm;
