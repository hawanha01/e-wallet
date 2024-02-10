import React from "react";

export default function Welcome() {
  return (
    <div>
      <h1>Welcome</h1>
      <a href="/users/login">Login</a> |{" "}
      <a href="/users/register">Registration</a>
    </div>
  );
}
