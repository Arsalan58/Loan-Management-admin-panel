import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from 'constants';

function EMIDetailsModal({ open, handleClose, loanId }) {
    const [emiDetails, setEmiDetails] = useState([]);

    useEffect(() => {
        if (loanId) {
            const fetchEMIDetails = async () => {
                try {
                    const response = await axios.get(`${BASE_URL}/api/web/retrieve/emis`,{
                        params:{loanId}
                    });
                    setEmiDetails(response.data.data);
                } catch (error) {
                    console.error('Failed to fetch EMI details:', error);
                }
            };
            fetchEMIDetails();
        }
    }, [loanId]);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>EMI Details</DialogTitle>
            <DialogContent>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>EMI ID</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Payment Date</TableCell>
                            <TableCell>Penalty</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {emiDetails.map((emi) => (
                            <TableRow key={emi.id}>
                                <TableCell>{emi.id}</TableCell>
                                <TableCell>{emi.amount}</TableCell>
                                <TableCell>{emi.dueDate}</TableCell>
                                <TableCell>{emi.paymentDate}</TableCell>
                                <TableCell>{emi.penalty}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EMIDetailsModal;
