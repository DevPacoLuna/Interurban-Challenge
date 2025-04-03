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
import { useState } from "react";
import {
  Authentication,
  signInValidationSchema,
  signUpValidationSchema,
} from "./Form";
import classes from "./Authentication.module.scss";

export const Auth = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(true);

  // Form submit handler for Sign Up and Sign In
  const handleSubmit = (values: Authentication) => {
    console.log("Form Submitted:", values);
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
              password: "",
              confirmPassword: "",
            }}
            validationSchema={
              isSignUp ? signUpValidationSchema : signInValidationSchema
            }
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, isSubmitting }) => (
              <Form>
                <Grid container spacing={2}>
                  {/* Email Field */}
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
                      onClick={() => setIsSignUp(!isSignUp)}
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
