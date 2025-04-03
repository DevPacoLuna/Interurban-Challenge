import {
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Avatar,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";

import { Formik, Field, Form, ErrorMessage } from "formik";
import { useContext, useState } from "react";
import {
  Authentication,
  signInValidationSchema,
  signUpValidationSchema,
} from "./Form";
import classes from "./Authentication.module.scss";
import { AuthContext } from "../../providers/AuthProvider";
import { generateToken } from "../../lib/helper/generateToken";
import { AlertContext } from "../../providers/AlertProvider";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const { login, setUser } = useContext(AuthContext);
  const { setAlertMessage, setOpenAlert } = useContext(AlertContext);
  const [isSignUp, setIsSignUp] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleSubmit = (values: Authentication) => {
    const username = values.userName !== "" ? values.userName : values.email;
    const token = generateToken(values.email + values.password);
    login(values.email, token);

    setUser(username);
    setAlertMessage({
      message: `Hello ${username}`,
      type: "success",
    });
    setOpenAlert(true);
    navigate("/");
  };

  return (
    <div className={classes.container}>
      <Container>
        <Paper className={classes.paper}>
          <Avatar
            className={classes.avatar}
            alt="Logo"
            src="https://via.placeholder.com/80"
          />
          <Typography variant="h4" className={classes.title}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </Typography>
          <Formik
            initialValues={{
              email: "",
              userName: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={
              isSignUp ? signUpValidationSchema : signInValidationSchema
            }
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, isSubmitting, resetForm }) => (
              <Form>
                <Grid container spacing={2}>
                  {/* Email Field */}
                  {isSignUp && (
                    <Grid item xs={12}>
                      <Field
                        name="userName"
                        as={TextField}
                        label="Username"
                        fullWidth
                        variant="outlined"
                        helperText={<ErrorMessage name="email" />}
                        error={Boolean(<ErrorMessage name="email" />)}
                        className={classes.formField}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Field
                      name="email"
                      as={TextField}
                      label="Email"
                      fullWidth
                      variant="outlined"
                      helperText={<ErrorMessage name="email" />}
                      error={Boolean(<ErrorMessage name="email" />)}
                      className={classes.formField}
                    />
                  </Grid>

                  {/* Password Field */}
                  <Grid item xs={12}>
                    <Field
                      name="password"
                      as={TextField}
                      label="Password"
                      fullWidth
                      type="password"
                      variant="outlined"
                      helperText={<ErrorMessage name="password" />}
                      error={Boolean(<ErrorMessage name="password" />)}
                      className={classes.formField}
                    />
                  </Grid>

                  {/* Confirm Password Field (Only for Sign Up) */}
                  {isSignUp && (
                    <Grid item xs={12}>
                      <Field
                        name="confirmPassword"
                        as={TextField}
                        label="Confirm Password"
                        fullWidth
                        type="password"
                        variant="outlined"
                        helperText={<ErrorMessage name="confirmPassword" />}
                        error={Boolean(<ErrorMessage name="confirmPassword" />)}
                        className={classes.formField}
                      />
                    </Grid>
                  )}

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      className={classes.submitButton}
                    >
                      {isSignUp ? "Sign Up" : "Sign In"}
                    </Button>
                  </Grid>

                  {/* Toggle between Sign In / Sign Up */}
                  <Grid item xs={12}>
                    <Button
                      variant="text"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        resetForm();
                      }}
                      className={classes.toggleButton}
                    >
                      {isSignUp
                        ? "Already have an account? Sign In"
                        : "Don’t have an account? Sign Up"}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Paper>
      </Container>
    </div>
  );
};
