import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
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
import MDSnackbar from "components/MDSnackbar";

function Dashboard() {
  const [successSB, setSuccessSB] = useState({ open: false, status: "", title: "" });
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true); // Loading state for skeleton
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

  const openSuccessSB = (status, title) => setSuccessSB({ open: true, status, title });
  const closeSuccessSB = () => setSuccessSB({ open: false, status: "", title: "" });

  const renderSuccessSB = (
    <MDSnackbar
      color={successSB.status === "success" ? "success" : successSB.status === "error" ? "warning" : "dark"}
      icon={successSB.status === "success" ? "check" : successSB.status === "error" ? "warning" : ""}
      title={successSB.title}
      content={content}
      dateTime="1 min ago"
      open={successSB.open}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/web/retrieve/dashboard-summary`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        const result = await response.json();
        if (result.type === "success") {
          const formattedLoans = result.data.recentLoans.map((loan) => ({
            ...loan,
            createdAt: moment(loan.createdAt).format("DD MMM YYYY HH:mm:ss"),
            finalAmount: loan.amount + loan.interestAmount,
          }));

          setData({
            ...result.data,
            recentLoans: formattedLoans,
            summary: {
              ...result.data.summary,
              totalActiveLoans: result.data.summary.totalActiveLoans || 0,   // Active Loans
              totalInactiveLoans: result.data.summary.totalInactiveLoans || 0, // Inactive Loans
              totalCollection: result.data.summary.totalCollection || 0,  // Add Total Collection
              todaysCollection: result.data.summary.todaysCollection || 0,  // Add Today's Collection
            },
          });

          openSuccessSB("success", "Dashboard data retrieved successfully");
          setContent("Dashboard data retrieved successfully");
        }
        else {
          openSuccessSB("error", "INTERNAL SERVER ERROR");
          setContent(`${result.data}`);
          console.error(result.message);
        }
      } catch (error) {
        openSuccessSB("error", "Failed to fetch dashboard data");
        setContent("Failed to fetch dashboard data");
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false); // Data fetching is done
      }
    };

    fetchData();
  }, []);

  // Columns definition for the DataTable
  const columns = [
    { Header: "Loan ID", accessor: "id" },
    { Header: "Customer Name", accessor: "customer.name" },
    { Header: "Final Amount", accessor: "finalAmount" },
    { Header: "Interest Rate", accessor: "interestRate" },
    { Header: "Interest Amount", accessor: "interestAmount" },
    { Header: "Loan Date", accessor: "createdAt" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {loading ? (
            <>
              <Grid item xs={12} md={6} lg={3}>
                <Skeleton variant="rounded" height={150} />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Skeleton variant="rounded" height={150} />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Skeleton variant="rounded" height={150} />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Skeleton variant="rounded" height={150} />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="dark"
                    icon="weekend"
                    title="Total Loans"
                    count={data.summary.totalLoans}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    icon="leaderboard"
                    title="Total Principal Amount"
                    count={`₹${data.summary.totalPrincipalAmount || 0}`}
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
                  />
                </MDBox>
              </Grid>

              {/* Cards for Active and Inactive Loans */}
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="info"
                    icon="check_circle"
                    title="Total Active Loans"
                    count={data.summary.totalActiveLoans}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="warning"
                    icon="highlight_off"
                    title="Total Inactive Loans"
                    count={data.summary.totalInactiveLoans}
                  />
                </MDBox>
              </Grid>

              {/* New Cards for Total Collection and Today's Collection */}
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="success"
                    icon="attach_money"
                    title="Total Collection"
                    count={`₹${data.summary.totalCollection}`} // Total Collection
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="info"
                    icon="money"
                    title="Today's Collection"
                    count={`₹${data.summary.todaysCollection}`} // Today's Collection
                  />
                </MDBox>
              </Grid>
            </>
          )}
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Typography variant="h6">Recent Loans</Typography>
              {loading ? (
                <Skeleton variant="rounded" height={400} />
              ) : (
                <DataTable
                  entriesPerPage={false}
                  canSearch
                  showTotalEntries
                  table={{ columns, rows: data.recentLoans }}
                  pagination={{ variant: "gradient", color: "info" }}
                  isSorted={false}
                  noEndBorder
                />
              )}
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              {loading ? (
                <Skeleton variant="rounded" height={200} />
              ) : (
                <LoanSummary summary={data.summary} />
              )}
            </Grid>
            <Grid item xs={12} md={6} lg={12}>
              {loading ? (
                <Skeleton variant="rounded" height={200} />
              ) : (
                <PenaltyOverview penalties={data.penalties} />
              )}
            </Grid>
          </Grid>
        </MDBox>
        {renderSuccessSB}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
