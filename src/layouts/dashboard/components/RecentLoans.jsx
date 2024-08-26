// src/layouts/dashboard/components/RecentLoans.js

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const RecentLoans = ({ loans }) => {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" gutterBottom>
        Recent Loans
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Loan ID</TableCell>
            <TableCell>Customer ID</TableCell>
            <TableCell>Amount (₹)</TableCell>
            <TableCell>Interest Rate (%)</TableCell>
            <TableCell>Interest Amount (₹)</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell>{loan.id}</TableCell>
              <TableCell>{loan.customerId}</TableCell>
              <TableCell>{loan.amount}</TableCell>
              <TableCell>{loan.interestRate}</TableCell>
              <TableCell>{loan.interestAmount}</TableCell>
              <TableCell>{loan.status}</TableCell>
              <TableCell>
                {new Date(loan.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecentLoans;
