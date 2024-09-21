import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from 'constants';

function CustomerDetailsModal({ open, handleClose, customerId }) {
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        if (customerId) {
            const fetchCustomerDetails = async () => {
                try {
                    const response = await axios.get(`${BASE_URL}/api/customers/${customerId}`,{
                        headers: {
                            "Authorization": localStorage.getItem("token")
                        }
                    });
                    setCustomer(response.data);
                } catch (error) {
                    console.error('Failed to fetch customer details:', error);
                }
            };
            fetchCustomerDetails();
        }
    }, [customerId]);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Customer Details</DialogTitle>
            <DialogContent>
                {customer ? (
                    <div>
                        <Typography variant="h6">Name: {customer.name}</Typography>
                        <Typography variant="body1">Email: {customer.email}</Typography>
                        <Typography variant="body1">Phone: {customer.phone}</Typography>
                        <Typography variant="body1">Address: {customer.address}</Typography>
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

export default CustomerDetailsModal;
