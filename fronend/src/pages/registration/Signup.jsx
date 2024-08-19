import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";

export default function Signup() {
  const [signupError, setSignupError] = React.useState("");
  const initialValues = {
    name: "",
    email: "",
    gender: "male",
    cnic: "",
    profileImage: "",
    contact: "",
    address: "",
    password: "",
    confirmPassword: "",
  };
  const navigate = useNavigate();
  return (
    <div>
      <h1>Registration</h1>
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const errors = {};
          if (
            values.name === "" ||
            values.email === "" ||
            values.gender === "" ||
            values.cnic === "" ||
            values.profileImage === "" ||
            values.contact === "" ||
            values.address === "" ||
            values.password === "" ||
            values.confirmPassword === ""
          ) {
            setSignupError("All Fields must be filled");
          }
          if (values.name === "") {
            errors.name = "Name Field must be filled";
          } else if (values.name.length < 2) {
            errors.name = "Names is too short at least 2 characters required";
          }
          if (values.email === "") {
            errors.email = "Email field must be filled";
          } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Email is invalid";
          }
          if (values.cnic === "") {
            errors.cnic = "CNIC Field must be filled";
          } else if (!/^\d{13}$/.test(values.cnic)) {
            errors.cnic = "CNIC is Invalid";
          }
          if (values.contact === "") {
            errors.contact = "Contact Field must be filled";
          } else if (!/^\d{11}$/.test(values.contact)) {
            errors.contact = "Contact is Invalid";
          }
          if (values.address === "") {
            errors.address = "Address field must be filled";
          }
          if (values.profileImage === "") {
            errors.profileImage = "Profile Image Required";
          }
          if (values.password === "") {
            errors.password = "password field must be filled";
          }
          if (values.confirmPassword === "") {
            errors.confirmPassword = "Confirm Password must be filled";
          }
          if (values.password !== values.confirmPassword) {
            setSignupError("Password mismatched");
          }
          return errors;
        }}
        onSubmit={async (values, { resetForm }) => {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/users/register`,
              values
            );
            if (response.data.success) {
              navigate("/users/OTPVerification", {
                state: response.data.userID,
              });
            } else {
              setSignupError(response.data.message);
            }
            resetForm();
          } catch (e) {
            setSignupError(
              e.message || "An error occurred during registration"
            );
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
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                minLength="2"
                placeholder="Name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                required
              />
              {errors.name && touched.name && errors.name}
            </div>
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
              <label htmlFor="gender">gender</label>
              <select
                name="gender"
                value={values.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && touched.gender && errors.gender}
            </div>
            <div>
              <label htmlFor="cnic">CNIC</label>
              <input
                type="text"
                name="cnic"
                minLength="13"
                placeholder="1234567890123"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.cnic}
                required
              />
              {errors.cnic && touched.cnic && errors.cnic}
            </div>
            <div>
              <label htmlFor="profileImage">Profile Image</label>
              <input
                type="file"
                name="profileImage"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.profileImage}
                required
              />
              {errors.profileImage &&
                touched.profileImage &&
                errors.profileImage}
            </div>
            <div>
              <label htmlFor="contact">Contact Number</label>
              <input
                type="text"
                name="contact"
                minLength="11"
                placeholder="03001234567"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.contact}
                required
              />
              {errors.contact && touched.contact && errors.contact}
            </div>
            <div>
              <label htmlFor="address">Address</label>
              <input
                type="text"
                name="address"
                placeholder="address"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address}
                required
              />
              {errors.address && touched.address && errors.address}
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                minLength="6"
                placeholder="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                required
              />
              {errors.password && touched.password && errors.password}
            </div>
            <div>
              <label htmlFor="confirmPassword">confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                minLength="6"
                placeholder="confirm Password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirmPassword}
                required
              />
              {errors.confirmPassword &&
                touched.confirmPassword &&
                errors.confirmPassword}
            </div>
            <div>
              <button type="submit" disabled={isSubmitting}>
                Register
              </button>
            </div>
            {signupError && <div>{signupError}</div>}
          </form>
        )}
      </Formik>
      <a href="/">Back to Home</a> | <a href="/users/login">Login</a>
    </div>
  );
}
