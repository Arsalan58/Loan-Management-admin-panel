import React, { useEffect } from "react";
import { useMaterialUIController, setLayout } from "context"; // Adjust the import path as necessary
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom"; // useNavigate instead of useHistory

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function Basic() {
    const [, dispatch] = useMaterialUIController();
    const navigate = useNavigate(); // Use useNavigate hook

    useEffect(() => {
        setLayout(dispatch, "login");

        // Optional: Reset layout on unmount if needed
        // return () => setLayout(dispatch, "dashboard");
    }, [dispatch]);

    const [rememberMe, setRememberMe] = useState(false);

    const handleSetRememberMe = () => setRememberMe(!rememberMe);

    // Formik configuration
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await fetch('http://localhost:3000/api/web/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                const result = await response.json();

                if (result.type === "success") {
                    // Store the token in localStorage or cookies
                    localStorage.setItem('token', result.data.token);

                    // Navigate to the dashboard
                    navigate('/dashboard');
                } else {
                    // Handle error - show a notification, alert, etc.
                    alert("Login failed: " + result.message);
                }
            } catch (error) {
                // Handle fetch error
                console.error('Error logging in:', error);
                alert("An error occurred during login. Please try again.");
            }
        }
    });

    return (
        <BasicLayout image={bgImage}>
            <Card>
                <MDBox
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                    mx={2}
                    mt={-3}
                    p={2}
                    mb={1}
                    textAlign="center"
                >
                    <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                        Sign in
                    </MDTypography>
                    <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                        <Grid item xs={2}>
                            <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                                <FacebookIcon color="inherit" />
                            </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                            <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                                <GitHubIcon color="inherit" />
                            </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                            <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                                <GoogleIcon color="inherit" />
                            </MDTypography>
                        </Grid>
                    </Grid>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <form onSubmit={formik.handleSubmit}>
                        <MDBox mb={2}>
                            <MDInput 
                                type="email"
                                label="Email"
                                fullWidth 
                                {...formik.getFieldProps('email')}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput 
                                type="password"
                                label="Password"
                                fullWidth 
                                {...formik.getFieldProps('password')}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                        </MDBox>
                        <MDBox display="flex" alignItems="center" ml={-1}>
                            <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                            <MDTypography
                                variant="button"
                                fontWeight="regular"
                                color="text"
                                onClick={handleSetRememberMe}
                                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                            >
                                &nbsp;&nbsp;Remember me
                            </MDTypography>
                        </MDBox>
                        <MDBox mt={4} mb={1}>
                            <MDButton type="submit" variant="gradient" color="info" fullWidth>
                                Sign in
                            </MDButton>
                        </MDBox>
                        <MDBox mt={3} mb={1} textAlign="center">
                            <MDTypography variant="button" color="text">
                                Don&apos;t have an account?{" "}
                                <MDTypography
                                    component={Link}
                                    to="/sign-up"
                                    variant="button"
                                    color="info"
                                    fontWeight="medium"
                                    textGradient
                                >
                                    Sign up
                                </MDTypography>
                            </MDTypography>
                        </MDBox>
                    </form>
                </MDBox>
            </Card>
        </BasicLayout>
    );
}

export default Basic;
