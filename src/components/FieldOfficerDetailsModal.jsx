import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from 'constants';

function FieldOfficerDetailsModal({ open, handleClose, fieldOfficerId }) {
    const [fieldOfficer, setFieldOfficer] = useState(null);

    useEffect(() => {
        if (fieldOfficerId) {
            const fetchFieldOfficerDetails = async () => {
                try {
                    const response = await axios.get(`${BASE_URL}/api/field-officers/${fieldOfficerId}`);
                    setFieldOfficer(response.data);
                } catch (error) {
                    console.error('Failed to fetch field officer details:', error);
                }
            };
            fetchFieldOfficerDetails();
        }
    }, [fieldOfficerId]);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Field Officer Details</DialogTitle>
            <DialogContent>
                {fieldOfficer ? (
                    <div>
                        <Typography variant="h6">Name: {fieldOfficer.name}</Typography>
                        <Typography variant="body1">Email: {fieldOfficer.email}</Typography>
                        <Typography variant="body1">Phone: {fieldOfficer.phone}</Typography>
                        <Typography variant="body1">Address: {fieldOfficer.address}</Typography>
                        {/* Add more fields as necessary */}
                    </div>
                ) : (
                    <Typography>Loading...</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FieldOfficerDetailsModal;
