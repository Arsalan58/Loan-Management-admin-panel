import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button } from "@mui/material";
import axios from "axios";
import { BASE_URL } from "constants";

const CustomerModal = ({ open, handleClose, openSuccessSB, setFilteredRows, changeTotal }) => {
  // Formik setup with initial values and validation schema
  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      PAN: "",
      Aadhaar: "",
      address: "",
      // loanPurpose: "",
      photo: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      mobile: Yup.string().required("Required"),
      PAN: Yup.string().required("Required"),
      Aadhaar: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
      // loanPurpose: Yup.string().required("Required"),
      photo: Yup.mixed().required("A photo is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const data = new FormData();
      data.append("name", values.name);
      data.append("mobile", values.mobile);
      data.append("PAN", values.PAN);
      data.append("Aadhaar", values.Aadhaar);
      data.append("address", values.address);
      // data.append("loanPurpose", values.loanPurpose);
      if (values.photo) {
        data.append("photo", values.photo); // Append photo to FormData
      }

      try {
        const response = await axios.post(`${BASE_URL}/api/web/create/customer`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.data.type === "success") {
          openSuccessSB("Customer created successfully.");
          setFilteredRows((prevRows) => [...prevRows, response.data.data]);
          changeTotal((prevTotal) => prevTotal + 1);
          resetForm(); // Reset form after successful submission
          handleClose(); // Close the modal
        } else {
          openSuccessSB("Error", "Failed to create customer.");
        }
      } catch (err) {
        console.error(err);
        openSuccessSB("Error", "An error occurred while creating the customer.");
      }
    },
  });

  // Destructuring formik's values, handleChange, handleSubmit, and errors
  const { values, errors, touched, handleChange, setFieldValue, handleSubmit } = formik;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New Customer</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>Please enter the customer's details below.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={values.name}
            onChange={handleChange}
            error={touched.name && Boolean(errors.name)}
            helperText={touched.name && errors.name}
          />
          <TextField
            margin="dense"
            name="mobile"
            label="Mobile"
            type="text"
            fullWidth
            value={values.mobile}
            onChange={handleChange}
            error={touched.mobile && Boolean(errors.mobile)}
            helperText={touched.mobile && errors.mobile}
          />
          <TextField
            margin="dense"
            name="PAN"
            label="PAN"
            type="text"
            fullWidth
            value={values.PAN}
            onChange={handleChange}
            error={touched.PAN && Boolean(errors.PAN)}
            helperText={touched.PAN && errors.PAN}
          />
          <TextField
            margin="dense"
            name="Aadhaar"
            label="Aadhaar"
            type="text"
            fullWidth
            value={values.Aadhaar}
            onChange={handleChange}
            error={touched.Aadhaar && Boolean(errors.Aadhaar)}
            helperText={touched.Aadhaar && errors.Aadhaar}
          />
          <TextField
            margin="dense"
            name="address"
            label="Address"
            type="text"
            fullWidth
            value={values.address}
            onChange={handleChange}
            error={touched.address && Boolean(errors.address)}
            helperText={touched.address && errors.address}
          />
          {/* <TextField
            margin="dense"
            name="loanPurpose"
            label="Loan Purpose"
            type="text"
            fullWidth
            value={values.loanPurpose}
            onChange={handleChange}
            error={touched.loanPurpose && Boolean(errors.loanPurpose)}
            helperText={touched.loanPurpose && errors.loanPurpose}
          /> */}
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="photo-upload"
            name="photo"
            type="file"
            onChange={(event) => setFieldValue("photo", event.target.files[0])}
          />
          <label htmlFor="photo-upload">
            <Button variant="contained"  sx={{background:"red", color:"white !important"}} component="span">
              Upload Photo
            </Button>
          </label>
          {touched.photo && errors.photo && (
            <div style={{ color: 'red', marginTop: '8px' }}>{errors.photo}</div>
          )}
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
    </Dialog>
  );
};

export default CustomerModal;
