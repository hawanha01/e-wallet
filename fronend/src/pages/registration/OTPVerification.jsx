import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { useLocation } from "react-router-dom";

export default function OTPVerification() {
  const [OTPerror, setOTPError] = React.useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const initialValues = { userID: location.state, otp: "" };
  const handleResendOTP = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users/resendOTP?userID=${location.state}`
      );
      if (response.data.success) {
        setOTPError(response.data.message);
      }
    } catch (e) {
      setOTPError(e.message || "server error");
    }
  };
  return (
    <div>
      <h1>OTP Verification</h1>
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const errors = {};
          if (values.otp === "") {
            errors.otp = "OTP must be provided";
          } else if (values.otp.length > 4) {
            errors.otp = "OTP max 4 character lengthy";
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const response = await axios.post(
              "http://localhost:5000/users/otpVerify",
              values
            );
            if (response.data.success) {
              navigate("/users/login");
            } else {
              setOTPError(response.data.message);
            }
          } catch (e) {
            setOTPError(e.message || "An Error occured during OTP verfication");
          } finally {
            setSubmitting(false);
          }
          resetForm();
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
              <input
                type="hidden"
                name="userID"
                value={values.userID}
                required
              />
            </div>
            <div>
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                name="otp"
                placeholder="1234"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.otp}
                required
              />
              {errors.otp && touched.otp && errors.otp}
            </div>
            <button type="submit" disabled={isSubmitting}>
              Verify
            </button>
            {OTPerror && <div>{OTPerror}</div>}
          </form>
        )}
      </Formik>
      <button onClick={() => handleResendOTP()}>Resend OTP</button>
      <a href="/">Back to Home</a>
    </div>
  );
}
