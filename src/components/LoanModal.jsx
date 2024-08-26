import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Grid, MenuItem, Typography, IconButton, Tooltip } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { BASE_URL } from 'constants';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
};

const validationSchema = Yup.object({
    loanAmount: Yup.number().typeError('Loan Amount must be a number').required('Loan Amount is required'),
    interestRate: Yup.number().typeError('Interest Rate must be a number or float').required('Interest Rate is required'),
    fieldOfficerId: Yup.string().required('Field Officer is required'),
    emiStartDate: Yup.date().required('EMI Start Date is required'),
    numberOfEmis: Yup.number().typeError('Number of EMIs must be a number').required('Number of EMIs is required'),
    emiFrequency: Yup.string().required('EMI Frequency is required'),
    description: Yup.string().required('Description is required'),
    guarantorId: Yup.string().required('Guarantor is required'),  // Add validation for Guarantor
});

function LoanModal({ open, handleClose, customerId }) {
    const [fieldOfficers, setFieldOfficers] = useState([]);
    const [guarantors, setGuarantors] = useState([]);
    const [selectedGuarantor, setSelectedGuarantor] = useState(null);
    const [showGuarantorModal, setShowGuarantorModal] = useState(false);
    const [emiAmount, setEmiAmount] = useState(null);
    const [showAddGuarantorModal, setShowAddGuarantorModal] = useState(false);
    const [newGuarantor, setNewGuarantor] = useState({
        name: '',
        mobile: '',
        PAN: '',
        Aadhaar: '',
        customerId: customerId,  // Pre-fill with the current customer ID
    });
    useEffect(() => {
        const fetchFieldOfficers = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/web/retrieve/field-officers`);
                setFieldOfficers(response.data.data.data);
            } catch (error) {
                console.error('Failed to fetch field officers:', error);
            }
        };

        const fetchGuarantors = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/web/retrieve/guarantors?customerId=${customerId}`, { headers: { "Authorization": localStorage.getItem("token") } });
                setGuarantors(response.data.data || []);
            } catch (error) {
                console.error('Failed to fetch guarantors:', error);
            }
        };

        fetchFieldOfficers();
        fetchGuarantors();
    }, [customerId]);

    const guarantorValidationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        mobile: Yup.string().required('Mobile number is required'),
        PAN: Yup.string().required('PAN is required'),
        Aadhaar: Yup.string().required('Aadhaar is required'),
    });

    const handleGuarantorChange = (event) => {
        const guarantorId = event.target.value;
        const guarantor = guarantors.find(g => g.id === guarantorId);
        setSelectedGuarantor(guarantor);
        formik.setFieldValue('guarantorId', guarantorId);
    };

    const handleViewGuarantorDetails = () => {
        setShowGuarantorModal(true);
    };

    const handleCloseGuarantorModal = () => {
        setShowGuarantorModal(false);
    };

    const handleAddGuarantor = () => {
        setShowAddGuarantorModal(true);
    };
    const handleGuarantorInputChange = (event) => {
        const { name, value } = event.target;
        setNewGuarantor({
            ...newGuarantor,
            [name]: value,
        });
    };
    const handleSubmitGuarantor = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/web/create/guarantor`, newGuarantor, {
                headers: { "Authorization": localStorage.getItem("token") }
            });
            console.log('Guarantor added successfully:', response.data);

            // Refresh guarantor list after adding
            const updatedGuarantors = await axios.get(`${BASE_URL}/api/web/retrieve/guarantors?customerId=${customerId}`, {
                headers: { "Authorization": localStorage.getItem("token") }
            });
            setGuarantors(updatedGuarantors.data.data || []);

            setShowAddGuarantorModal(false);
        } catch (error) {
            console.error('Failed to add guarantor:', error);
        }
    };

    const formik = useFormik({
        initialValues: {
            customerId: customerId || '',
            loanAmount: '',
            interestRate: '',
            fieldOfficerId: '',
            emiStartDate: '',
            numberOfEmis: '',
            emiFrequency: 'Monthly',
            description: '',
            guarantorId: '',  // Add guarantor field
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const {
                    customerId,
                    loanAmount: amount,
                    interestRate,
                    fieldOfficerId,
                    numberOfEmis: numberOfEMIs,
                    emiStartDate: startDate,
                    emiFrequency: frequency,
                    description,
                    guarantorId,
                } = values;

                const response = await axios.post(`${BASE_URL}/api/web/create/loan`, {
                    customerId,
                    amount,
                    interestRate,
                    fieldOfficerId,
                    numberOfEMIs,
                    startDate,
                    frequency,
                    description,
                    guarantorId,
                });

                console.log('Loan created successfully:', response.data);

                handleClose();
                resetForm();
            } catch (error) {
                console.error('Failed to create loan:', error);
            } finally {
                setSubmitting(false);
            }
        },
        enableReinitialize: true,
    });
    const guarantorFormik = useFormik({
        initialValues: {
            name: '',
            mobile: '',
            PAN: '',
            Aadhaar: '',
            customerId: customerId || '',
        },
        validationSchema: guarantorValidationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const response = await axios.post(`${BASE_URL}/api/web/create/guarantor`, values, {
                    headers: { "Authorization": localStorage.getItem("token") }
                });
                console.log('Guarantor added successfully:', response.data);

                // Refresh guarantor list after adding
                const updatedGuarantors = await axios.get(`${BASE_URL}/api/web/retrieve/guarantors?customerId=${customerId}`, {
                    headers: { "Authorization": localStorage.getItem("token") }
                });
                setGuarantors(updatedGuarantors.data.data || []);

                setShowAddGuarantorModal(false);
                resetForm();
            } catch (error) {
                console.error('Failed to add guarantor:', error);
            } finally {
                setSubmitting(false);
            }
        },
        enableReinitialize: true
    });


    useEffect(() => {
        if (formik.values.loanAmount && formik.values.interestRate && formik.values.numberOfEmis) {
            const emi = calculateEMI(formik.values.loanAmount, formik.values.interestRate, formik.values.numberOfEmis, formik.values.emiFrequency);
            setEmiAmount(emi);
        }
    }, [formik.values.loanAmount, formik.values.interestRate, formik.values.numberOfEmis]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="create-loan-modal"
        >
            <Box sx={modalStyles}>
                <h2 id="create-loan-modal">Create New Loan</h2>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                name="customerId"
                                label="Customer ID"
                                value={formik.values.customerId}
                                onChange={formik.handleChange}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="loanAmount"
                                label="Loan Amount"
                                type="number"
                                value={formik.values.loanAmount}
                                onChange={formik.handleChange}
                                error={formik.touched.loanAmount && Boolean(formik.errors.loanAmount)}
                                helperText={formik.touched.loanAmount && formik.errors.loanAmount}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="interestRate"
                                label="Interest Rate (%)"
                                type="number"
                                placeholder="Enter in number or float"
                                value={formik.values.interestRate}
                                onChange={formik.handleChange}
                                error={formik.touched.interestRate && Boolean(formik.errors.interestRate)}
                                helperText={formik.touched.interestRate && formik.errors.interestRate}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="fieldOfficerId"
                                label="Field Officer"
                                select
                                value={formik.values.fieldOfficerId}
                                onChange={formik.handleChange}
                                error={formik.touched.fieldOfficerId && Boolean(formik.errors.fieldOfficerId)}
                                helperText={formik.touched.fieldOfficerId && formik.errors.fieldOfficerId}
                                fullWidth
                                InputProps={{
                                    style: { padding: '10px 14px' },
                                    endAdornment: (
                                        <>
                                            {/* <IconButton > */}
                                            <KeyboardArrowDownIcon sx={{
                                                "&:hover": {
                                                    cursor: "pointer",
                                                    // backgroundColor: 'rgb(7, 177, 77, 0.42)'
                                                }
                                            }} />
                                            {/* </IconButton> */}
                                        </>
                                    )
                                }}
                            >
                                {fieldOfficers?.map((officer) => (
                                    <MenuItem key={officer.id} value={officer.id}>
                                        {officer.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="guarantorId"
                                label="Guarantor"
                                select
                                value={formik.values.guarantorId}
                                onChange={handleGuarantorChange}
                                error={formik.touched.guarantorId && Boolean(formik.errors.guarantorId)}
                                helperText={formik.touched.guarantorId && formik.errors.guarantorId}
                                fullWidth
                                InputProps={{
                                    style: { padding: '4px 14px' },
                                    endAdornment: (
                                        <>
                                            <IconButton onClick={handleViewGuarantorDetails}>
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton onClick={handleAddGuarantor}>
                                                <AddIcon />
                                            </IconButton>
                                        </>
                                    )
                                }}
                            >
                                {guarantors.length > 0 ? (
                                    guarantors.map((guarantor) => (
                                        <MenuItem key={guarantor.id} value={guarantor.id}>
                                            {guarantor.name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No Guarantors Available</MenuItem>
                                )}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="emiStartDate"
                                label="EMI Start Date"
                                type="date"
                                value={formik.values.emiStartDate}
                                onChange={formik.handleChange}
                                error={formik.touched.emiStartDate && Boolean(formik.errors.emiStartDate)}
                                helperText={formik.touched.emiStartDate && formik.errors.emiStartDate}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="numberOfEmis"
                                label="Number of EMIs"
                                type="number"
                                value={formik.values.numberOfEmis}
                                onChange={formik.handleChange}
                                error={formik.touched.numberOfEmis && Boolean(formik.errors.numberOfEmis)}
                                helperText={formik.touched.numberOfEmis && formik.errors.numberOfEmis}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="emiFrequency"
                                label="EMI Frequency"
                                select
                                value={formik.values.emiFrequency}
                                onChange={formik.handleChange}
                                InputProps={{
                                    style: { padding: '10.5px 14px' },
                                    endAdornment: (
                                        <>
                                            {/* <IconButton > */}
                                            <KeyboardArrowDownIcon sx={{
                                                "&:hover": {
                                                    cursor: "pointer",
                                                    // backgroundColor: 'rgb(7, 177, 77, 0.42)'
                                                }
                                            }} />
                                            {/* </IconButton> */}
                                        </>
                                    )
                                }}

                                error={formik.touched.emiFrequency && Boolean(formik.errors.emiFrequency)}
                                helperText={formik.touched.emiFrequency && formik.errors.emiFrequency}
                                fullWidth
                            >
                                <MenuItem value="Daily">Daily</MenuItem>
                                <MenuItem value="Weekly">Weekly</MenuItem>
                                <MenuItem value="Monthly">Monthly</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="emiAmount"
                                label="Calculated EMI Amount"
                                value={emiAmount || 0}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="description"
                                label="Description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                                multiline
                                rows={3}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Box mt={3} display="flex" justifyContent="flex-end">
                        <Button onClick={handleClose} variant="outlined" sx={{ mr: 2, color: "black !important" }}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" sx={{ background: "red", color: "white !important" }}>
                            Create Loan
                        </Button>
                    </Box>
                </form>

                {/* Guarantor Details Modal */}
                {/* Guarantor Details Modal */}
                <Modal
                    open={showGuarantorModal}
                    onClose={handleCloseGuarantorModal}
                    aria-labelledby="guarantor-details-modal"
                >
                    <Box sx={modalStyles}>
                        <Typography variant="h6" gutterBottom>
                            Guarantor Details
                        </Typography>
                        {selectedGuarantor ? (
                            <div>
                                <Typography><strong>Name:</strong> {selectedGuarantor.name}</Typography>
                                <Typography><strong>Mobile:</strong> {selectedGuarantor.mobile}</Typography>
                                <Typography><strong>PAN:</strong> {selectedGuarantor.PAN}</Typography>
                                <Typography><strong>Aadhaar:</strong> {selectedGuarantor.Aadhaar}</Typography>
                            </div>
                        ) : (
                            <Typography>No guarantor selected.</Typography>
                        )}
                        <Box mt={3} display="flex" justifyContent="flex-end">
                            <Button onClick={handleCloseGuarantorModal} sx={{ color: "white !important" }} variant="contained" >
                                Close
                            </Button>
                        </Box>
                    </Box>
                </Modal>

                {/* Add Guarantor Modal with useFormik */}
                <Modal
                    open={showAddGuarantorModal}
                    onClose={() => setShowAddGuarantorModal(false)}
                    aria-labelledby="add-guarantor-modal"
                >
                    <Box sx={modalStyles}>
                        <Typography variant="h6" gutterBottom>
                            Add New Guarantor
                        </Typography>
                        <form onSubmit={guarantorFormik.handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        name="customerId"
                                        label="Customer ID"
                                        value={guarantorFormik.values.customerId}
                                        fullWidth
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name="name"
                                        label="Name"
                                        value={guarantorFormik.values.name}
                                        onChange={guarantorFormik.handleChange}
                                        error={guarantorFormik.touched.name && Boolean(guarantorFormik.errors.name)}
                                        helperText={guarantorFormik.touched.name && guarantorFormik.errors.name}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name="mobile"
                                        label="Mobile"
                                        value={guarantorFormik.values.mobile}
                                        onChange={guarantorFormik.handleChange}
                                        error={guarantorFormik.touched.mobile && Boolean(guarantorFormik.errors.mobile)}
                                        helperText={guarantorFormik.touched.mobile && guarantorFormik.errors.mobile}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name="PAN"
                                        label="PAN"
                                        value={guarantorFormik.values.PAN}
                                        onChange={guarantorFormik.handleChange}
                                        error={guarantorFormik.touched.PAN && Boolean(guarantorFormik.errors.PAN)}
                                        helperText={guarantorFormik.touched.PAN && guarantorFormik.errors.PAN}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name="Aadhaar"
                                        label="Aadhaar"
                                        value={guarantorFormik.values.Aadhaar}
                                        onChange={guarantorFormik.handleChange}
                                        error={guarantorFormik.touched.Aadhaar && Boolean(guarantorFormik.errors.Aadhaar)}
                                        helperText={guarantorFormik.touched.Aadhaar && guarantorFormik.errors.Aadhaar}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                            <Box mt={3} display="flex" justifyContent="flex-end">
                                <Button onClick={() => setShowAddGuarantorModal(false)} variant="outlined" sx={{ mr: 2, color: "black !important" }}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" sx={{ background: "red !important", color: "white !important" }}>
                                    Add Guarantor
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Modal>
            </Box>
        </Modal>


    );
}

function calculateEMI(loanAmount, interestRate, numberOfEmis, emiFrequency) {
    const rate = interestRate / 100 / 12; // Assuming interest rate is per annum and EMI frequency is monthly
    const n = numberOfEmis;
    const emi = (loanAmount * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
    return emi.toFixed(2); // Return the EMI amount rounded to 2 decimal places
}

export default LoanModal;
