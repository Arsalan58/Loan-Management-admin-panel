import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Button,
    Grid,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box,
} from "@mui/material";
import axios from "axios";
import { BASE_URL } from "constants";

const FieldOfficerModal = ({
    open,
    handleClose,
    openSuccessSB,
    setFilteredRows,
    changeTotal,
}) => {
    const formik = useFormik({
        initialValues: {
            name: "",
            mobile: "",
            assignedArea: "",
            password: "",
            status: "Active",
            photo: null,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Required"),
            mobile: Yup.string().required("Required").test("len","Mobile should be of 10 digits", value => value.length === 10),
            assignedArea: Yup.string().required("Required"),
            password: Yup.string().required("Required"),
            status: Yup.string().required("Required"),
            photo: Yup.mixed().required("A photo is required"),
        }),
        onSubmit: async (values, { resetForm }) => {
            const data = new FormData();
            data.append("name", values.name);
            data.append("mobile", values.mobile);
            data.append("assignedArea", values.assignedArea);
            data.append("password", values.password);
            data.append("status", values.status);
            if (values.photo) {
                data.append("photo", values.photo);
            }

            try {
                const response = await axios.post(`${BASE_URL}/api/web/create/field-officer`, data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization":localStorage.getItem("token")
                    },
                });
                if (response.data.type === "success") {
                    openSuccessSB("success","Field Officer created successfully.");
                    setFilteredRows((prevRows) => [response.data.data,...prevRows, ]);
                    changeTotal((prevTotal) => prevTotal + 1);
                    resetForm();
                    handleClose();
                } else {
                    openSuccessSB("error", "Failed to create field officer.");
                }
            } catch (err) {
                console.error(err);
                openSuccessSB("error", err.response.data.message);
            }
        },
    });

    const { values, errors, touched, handleChange, setFieldValue, handleSubmit } = formik;

    return (

        <Dialog  open={open}  onClose={handleClose}>
            <Box sx={{backgroundColor:"black"}}>
            <DialogTitle >Create New Field Officer</DialogTitle>
            <form onSubmit={handleSubmit} >
                <DialogContent  >
                    <DialogContentText>
                        Please enter the field officer's details below.
                    </DialogContentText>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="name"
                                label="Name"
                                type="text"
                                fullWidth
                                value={values.name.charAt(0).toUpperCase() + values.name.slice(1, values.name.length)}
                                onChange={handleChange}
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="mobile"
                                label="Mobile"
                                type="number"
                                fullWidth
                                value={values.mobile}
                                onChange={handleChange}
                                error={touched.mobile && Boolean(errors.mobile)}
                                helperText={touched.mobile && errors.mobile}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="assignedArea"
                                label="Assigned Area"
                                type="text"
                                fullWidth
                                value={values.assignedArea}
                                onChange={handleChange}
                                error={touched.assignedArea && Boolean(errors.assignedArea)}
                                helperText={touched.assignedArea && errors.assignedArea}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="password"
                                label="Password"
                                type="password"
                                fullWidth
                                value={values.password}
                                onChange={handleChange}
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    name="status"
                                    value={values.status}
                                    onChange={handleChange}
                                    error={touched.status && Boolean(errors.status)}
                                    label="Status"
                                >
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Inactive">Inactive</MenuItem>
                                    <MenuItem value="Suspended">Suspended</MenuItem>
                                </Select>
                                {touched.status && errors.status && (
                                    <div style={{ color: "red", marginTop: "8px" }}>{errors.status}</div>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <input
                                accept="image/*"
                                style={{ display: "none" }}
                                id="photo-upload"
                                name="photo"
                                type="file"
                                onChange={(event) => setFieldValue("photo", event.target.files[0])}
                            />
                            <label htmlFor="photo-upload">
                                <Button variant="contained" component="span" sx={{ backgroundColor: "#1976d2", color: "white !important" }}>
                                    Upload Photo
                                </Button>
                            </label>
                            {touched.photo && errors.photo && (
                                <div style={{ color: "red", marginTop: "8px" }}>{errors.photo}</div>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">
                        Create
                    </Button>
                </DialogActions>
            </form>

            </Box>
        </Dialog>
    );
};

export default FieldOfficerModal;
