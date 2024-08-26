import React from 'react';
import PropTypes from 'prop-types';
import MDBox from "components/MDBox";
import { Card, CardContent, Typography } from "@mui/material";

const LoanSummary = ({ summary }) => {
  return (
    <MDBox>
      <Typography variant="h6">Loan Summary</Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">Total Loans: {summary.totalLoans}</Typography>
          <Typography variant="body1">Total Principal Amount: ₹{summary.totalPrincipalAmount}</Typography>
          <Typography variant="body1">Total Interest Amount: ₹{summary.totalInterestAmount}</Typography>
          <Typography variant="body1">Total Revenue: ₹{summary.totalRevenue}</Typography>
        </CardContent>
      </Card>
    </MDBox>
  );
};

LoanSummary.propTypes = {
  summary: PropTypes.object.isRequired
};

export default LoanSummary;
