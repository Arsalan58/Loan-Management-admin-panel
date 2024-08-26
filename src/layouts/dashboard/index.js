import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import DataTable from "examples/Tables/DataTable";
import LoanSummary from "layouts/dashboard/components/LoanSummary";
import PenaltyOverview from "layouts/dashboard/components/PenaltyOverview";
import { BASE_URL } from "constants";
import moment from "moment-timezone";
import { Typography } from "@mui/material";

function Dashboard() {
  const [data, setData] = useState({
    recentLoans: [],
    summary: {
      totalLoans: 0,
      totalPrincipalAmount: 0,
      totalInterestAmount: 0,
      totalRevenue: 0,
    },
    penalties: {
      totalPenalties: 0,
      totalAmount: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/web/retrieve/dashboard-summary`);
        const result = await response.json();
        if (result.type === "success") {
          // Format the createdAt date and calculate the final amount
          const formattedLoans = result.data.recentLoans.map(loan => ({
            ...loan,
            createdAt: moment(loan.createdAt).format('DD MMM YYYY HH:mm:ss'), // Format the date
            finalAmount: loan.amount + loan.interestAmount // Calculate the final amount
          }));

          setData({
            ...result.data,
            recentLoans: formattedLoans,
          });
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchData();
  }, []);

  // Columns definition for the DataTable
  const columns = [
    { Header: "Loan ID", accessor: "id" },
    { Header: "Customer Name", accessor: "customer.name" },
    // { Header: "Principal Amount", accessor: "amount" },
    { Header: "Final Amount", accessor: "finalAmount" }, // Add the Final Amount column
    { Header: "Interest Rate", accessor: "interestRate" },
    { Header: "Interest Amount", accessor: "interestAmount" },
    { Header: "Loan Date", accessor: "createdAt" }, // This will now show the formatted date
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Total Loans"
                count={data.summary.totalLoans}
                percentage={{
                  color: "success",
                  amount: "+5%",
                  label: "compared to last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Total Principal Amount"
                count={`₹${data.summary.totalPrincipalAmount}`}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "compared to last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Total Interest Amount"
                count={`₹${data.summary.totalInterestAmount}`}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "compared to last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Total Revenue"
                count={`₹${data.summary.totalRevenue}`}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Typography variant="h6">Recent Loans</Typography>
              <DataTable
                entriesPerPage={{ defaultValue: 5 }}
                canSearch
                showTotalEntries
                table={{ columns, rows: data.recentLoans }}
                pagination={{ variant: "gradient", color: "info" }}
                isSorted={false}
                noEndBorder
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <LoanSummary summary={data.summary} />
            </Grid>
            <Grid item xs={12} md={6} lg={12}>
              <PenaltyOverview penalties={data.penalties} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
