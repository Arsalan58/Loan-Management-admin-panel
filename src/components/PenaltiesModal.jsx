import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from 'constants';

function PenaltiesModal({ open, handleClose, loanId }) {
    const [penalties, setPenalties] = useState([]);

    useEffect(() => {
        if (loanId) {
            const fetchPenalties = async () => {
                try {
                    const response = await axios.get(`${BASE_URL}/api/loans/${loanId}/penalties`);
                    setPenalties(response.data);
                } catch (error) {
                    console.error('Failed to fetch penalties:', error);
                }
            };
            fetchPenalties();
        }
    }, [loanId]);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Penalties</DialogTitle>
            <DialogContent>
                {penalties.length ? (
                    penalties.map((penalty) => (
                        <Typography key={penalty.id}>
                            Penalty ID: {penalty.id} - Amount: {penalty.amount} - Date: {penalty.date}
                        </Typography>
                    ))
                ) : (
                    <Typography>No penalties found.</Typography>
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

export default PenaltiesModal;
