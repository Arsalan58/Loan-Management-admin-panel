import React, { useEffect, useState } from "react";
import { useMaterialUIController, setLayout } from "context";
import { useFormik } from "formik";
import * as Yup from "yup";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
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
import MDSnackbar from "components/MDSnackbar";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { BASE_URL } from "constants";

function Basic() {
    const [, dispatch] = useMaterialUIController();
    const navigate = useNavigate();
    
    useEffect(() => {
        setLayout(dispatch, "login");
    }, [dispatch]);

    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successSB, setSuccessSB] = useState({ status: "", message: "" });

    const handleSetRememberMe = () => setRememberMe(!rememberMe);

    // Snackbar handlers
    const closeSuccessSB = () => setSuccessSB({ status: "", message: "" });

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
            setLoading(true);
            try {
                const response = await fetch(`${BASE_URL}/api/web/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                const result = await response.json();
                setLoading(false);

                if (result.type === "success") {
                    localStorage.setItem('token', result.data.token);
                    navigate('/dashboard');
                } else {
                    setSuccessSB({ status: "error", message: result.message });
                }
            } catch (error) {
                setLoading(false);
                setSuccessSB({ status: "error", message: "An error occurred during login. Please try again." });
            }
        }
    });

    // Snackbar rendering
    const renderSuccessSB = (
        <MDSnackbar
            color={successSB.status === "success" ? "success" : successSB.status === "error" ? "warning" : "dark"}
            icon={successSB.status === "success" ? "check" : successSB.status === "error" ? "warning" : ""}
            title={successSB.status ? successSB.status : ""}
            content={successSB.message ? successSB.message : ""}
            dateTime="1 min ago"
            open={Boolean(successSB.status)}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite
        />
    );

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
                        {/* <MDBox display="flex" alignItems="center" ml={-1}>
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
                        </MDBox> */}
                        <MDBox mt={4} mb={1}>
                            <MDButton
                                type="submit"
                                variant="gradient"
                                color="info"
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign in"}
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
            {renderSuccessSB}
        </BasicLayout>
    );
}

export default Basic;
