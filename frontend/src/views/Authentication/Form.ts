import * as Yup from "yup";

export interface Authentication {
  email: string;
  password: string;
  confirmPassword: string;
}

// Validation schemas for Sign In and Sign Up forms
export const signUpValidationSchema: Yup.Schema<Authentication> = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const signInValidationSchema: Yup.Schema<
  Omit<Authentication, "confirmPassword">
> = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
