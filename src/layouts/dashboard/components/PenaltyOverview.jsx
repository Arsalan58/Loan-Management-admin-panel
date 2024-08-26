import React from 'react';
import PropTypes from 'prop-types';
import MDBox from "components/MDBox";
import { Card, CardContent, Typography } from "@mui/material";

const PenaltyOverview = ({ penalties }) => {
  return (
    <MDBox>
      <Typography variant="h6">Penalty Overview</Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">Total Penalties: {penalties.totalPenalties}</Typography>
          <Typography variant="body1">Total Amount: ₹{penalties.totalAmount}</Typography>
        </CardContent>
      </Card>
    </MDBox>
  );
};

PenaltyOverview.propTypes = {
  penalties: PropTypes.object.isRequired
};

export default PenaltyOverview;
