import React from "react";
import axios from "axios";
import { Formik } from "formik";
import { useAuth } from "../../utils/AuthContext";
export default function Login() {
  const [loginError, setLoginError] = React.useState("");
  const { login } = useAuth();
  const initialValues = { email: "", password: "" };
  return (
    <div>
      <h1>Login</h1>
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = "Email Required";
          } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Invalid Email Address";
          }
          if (!values.password) {
            errors.password = "Password Required";
          } else if (values.password.length < 6) {
            errors.password = "Password min 6 length required";
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/users/login`,
              values
            );
            if (response.data.success) {
              login(response.data.user);
              window.location.href = "/dashboard";
            } else {
              setLoginError(response.data.message);
            }
          } catch (e) {
            setLoginError(e.message || "An error occurred during Login");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                required
              />
              {errors.email && touched.email && errors.email}
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                required
              />
              {errors.password && touched.password && errors.password}
            </div>
            <div>
              <button type="submit" disabled={isSubmitting}>
                Login
              </button>
            </div>
            {loginError && <div>{loginError}</div>}
          </form>
        )}
      </Formik>
      <a href="/">Back to Home</a> | <a href="/users/register">Registration</a>
    </div>
  );
}
