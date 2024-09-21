import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { BASE_URL } from "constants";

const CustomerModal = ({
  open,
  handleClose,
  openSuccessSB,
  setFilteredRows,
  changeTotal,
  isEditMode = false, // New prop to identify if it's edit mode
  initialData = {}, // New prop for pre-populating data in edit mode
}) => {
  const formik = useFormik({
    initialValues: {
      name: initialData.name || "",
      mobile: initialData.mobile || "",
      PAN: initialData.PAN || "",
      Aadhaar: initialData.Aadhaar || "",
      address: initialData.address || "",
      custId: initialData.custId || "",
      photo: null,
    },
    enableReinitialize: true, // Allows the form to reinitialize when initialData changes
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      mobile: Yup.string().required("Required"),
      custId: Yup.string().required("Required"),
      Aadhaar: Yup.string()
        .required("Required")
        .test("len", "Must be of exactly 12 number", (val) => val?.length === 12),
      address: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const data = new FormData();
      data.append("name", values.name);
      data.append("mobile", values.mobile);
      data.append("custId", values.custId);
      data.append(
        "PAN",
        values.PAN.toUpperCase().slice(0, values.PAN.length - 1) +
        values.PAN.slice(values.PAN.length - 1, values.PAN.length).toUpperCase()
      );
      data.append("Aadhaar", values.Aadhaar);
      data.append("address", values.address);
      if (values.photo) {
        data.append("photo", values.photo);
      }

      try {
        let response;
        if (isEditMode) {
          // If in edit mode, send an update request
          response = await axios.put(`${BASE_URL}/api/web/update/customer`, data, {
            params: { id: initialData.id },
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: localStorage.getItem("token"),
            },
          });
        } else {
          // If in create mode, send a create request
          response = await axios.post(`${BASE_URL}/api/web/create/customer`, data, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: localStorage.getItem("token"),
            },
          });
        }

        if (response.data.type === "success") {
          const message = isEditMode ? "Customer updated successfully." : "Customer created successfully.";
          openSuccessSB("success", message);

          if (!isEditMode) {
            setFilteredRows((prevRows) => {
              // Return the new array with the new data at the beginning
              return [response.data.data, ...prevRows];
            });
            changeTotal((prevTotal) => prevTotal + 1);
          } else {
            setFilteredRows((prevRows) =>
              prevRows.map((row) => {
                if (row.id !== initialData.id) {
                  return row;
                } else {
                  return {
                    ...row, 
                    ...values, 
                    // id: row.id, 
                  };
                }
              })
            );
          }
          
          resetForm();
          handleClose();
        } else {
          openSuccessSB("error", response.data.message);
        }
      } catch (err) {
        console.error(err);
        openSuccessSB("error", err.response.data.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Destructuring formik's values, handleChange, handleSubmit, and errors
  const { values, errors, touched, handleChange, setFieldValue, handleSubmit } = formik;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isEditMode ? "Edit Customer" : "Create New Customer"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            {isEditMode ? "Modify the customer's details below." : "Please enter the customer's details below."}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="custId"
            label="Customer ID"
            type="number"
            fullWidth
            value={values.custId}
            onChange={handleChange}
            error={touched.custId && Boolean(errors.custId)}
            helperText={touched.custId && errors.custId}
            // disabled={isEditMode} // Disable ID field in edit mode
          />
          <TextField
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
            value={values.PAN.toUpperCase().slice(0, values.PAN.length - 1) + values.PAN.slice(values.PAN.length - 1, values.PAN.length).toUpperCase()}
            onChange={handleChange}
            error={touched.PAN && Boolean(errors.PAN)}
            helperText={touched.PAN && errors.PAN}
          />
          <TextField
            margin="dense"
            name="Aadhaar"
            label="Aadhaar"
            type="number"
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
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="photo-upload"
            name="photo"
            type="file"
            onChange={(event) => setFieldValue("photo", event.target.files[0])}
          />
          <label htmlFor="photo-upload">
            <Button
              variant="contained"
              sx={{ background: "red", color: "white !important" }}
              component="span"
            >
              Upload Photo
            </Button>
          </label>
          {touched.photo && errors.photo && <div style={{ color: "red", marginTop: "8px" }}>{errors.photo}</div>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ color: "white !important" }}
            disabled={formik.isSubmitting}
            color="primary"
          >
            {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : isEditMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CustomerModal;
