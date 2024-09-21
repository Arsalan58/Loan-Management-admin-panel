import React from 'react';
import PropTypes from 'prop-types';
import MDBox from "components/MDBox";
import { Card, CardContent, Typography } from "@mui/material";

const LoanSummary = ({ summary }) => {
  return (
    <MDBox>
      <Typography variant="h6">Loan Summary</Typography>
      <Card>
        <CardContent >
          <Typography variant="body1" sx={{ fontSize: 17, color: "#7b809a" }}>Total Loans: {summary.totalLoans}</Typography>
          <Typography variant="body1" sx={{ fontSize: 17, color: "#7b809a" }}>Total Principal Amount: ₹{summary.totalPrincipalAmount || 0}</Typography>
          <Typography variant="body1" sx={{ fontSize: 17, color: "#7b809a" }}>Total Interest Amount: ₹{summary.totalInterestAmount}</Typography>
          <Typography variant="body1" sx={{ fontSize: 17, color: "#7b809a" }}>Total Revenue: ₹{summary.totalRevenue}</Typography>
        </CardContent>
      </Card>
    </MDBox>
  );
};

LoanSummary.propTypes = {
  summary: PropTypes.object.isRequired
};

export default LoanSummary;
