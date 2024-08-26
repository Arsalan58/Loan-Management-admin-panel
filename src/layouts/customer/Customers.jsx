import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDSnackbar from "components/MDSnackbar";
import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import moment from "moment";
import CustomerModal from "../../components/CustomerModal";
import LoanModal from "../../components/LoanModal";
import { usePagination } from "hooks/usePagination";
import { BASE_URL } from "constants";
import Footer from "examples/Footer";

function Customers() {
    const [content, setContent] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const { page, limit, total, changePage, changeLimit, changeTotal } = usePagination();
    const [successSB, setSuccessSB] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [loanModalOpen, setLoanModalOpen] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);

    const openSuccessSB = (title) => setSuccessSB(title);
    const closeSuccessSB = () => setSuccessSB(false);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleOpenLoanModal = (customerId) => {
        setSelectedCustomerId(customerId);
        setLoanModalOpen(true);
    };

    const handleCloseLoanModal = () => {
        setLoanModalOpen(false);
    };

    const theme = createTheme({
        palette: {
            primary: { main: '#1976d2' },
            secondary: { main: '#d32f2f' },
            success: { main: '#2e7d32' },
        },
        typography: {
            fontFamily: "Roboto,Helvetica, Arial, sans-serif",
        },
        components: {
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#f4f6f8',
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#1976d2',
                            fontSize: '1.1rem',
                        },
                    },
                },
            },
        },
    });

    const renderSuccessSB = (
        <MDSnackbar
            color={successSB ? "success" : "warning"}
            icon={successSB ? "check" : "warning"}
            title={successSB ? successSB : ""}
            content={content ? content : ""}
            dateTime="1 min ago"
            open={Boolean(successSB)}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite
        />
    );

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'mobile', headerName: 'Mobile', width: 150 },
        { field: 'PAN', headerName: 'PAN', width: 150 },
        { field: 'Aadhaar', headerName: 'Aadhaar', width: 150 },
        { field: 'address', headerName: 'Address', width: 200 },
        // { field: 'loanPurpose', headerName: 'Loan Purpose', width: 200 },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenLoanModal(params.row.id)}
                >
                    Create Loan
                </Button>
            ),
        },
    ];

    const fetchCustomers = async (query = "") => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/web/retrieve/customers`, {
                params: { page, limit, mobile: query },
            });
            if (response.data.type === "success") {
                openSuccessSB(response.data.message);
                setFilteredRows(response.data.data.data);
                changeTotal(response.data.data.total);
            } else {
                setContent("Failed to retrieve customers.");
                openSuccessSB("Error");
            }
        } catch (err) {
            console.error(err);
            setContent("An error occurred while fetching customers.");
            openSuccessSB("Error");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCustomers(searchQuery);
    }, [page, limit]);

    const handleSearch = () => {
        fetchCustomers(searchQuery);
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                sx={{ display: "flex", justifyContent: "space-between" }}
                            >
                                <MDTypography variant="h6" sx={{ alignContent: "center" }} color="white">
                                    Customers Table
                                </MDTypography>
                                <MDBox sx={{ display: "flex", alignItems: "center" }}>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        placeholder="Search by PAN or Mobile"
                                        sx={{
                                            marginRight: 1,
                                            backgroundColor: "white !important",
                                            borderRadius: "4px !important"
                                        }}
                                        value={searchQuery}
                                        onChange={handleSearchInputChange}
                                    />
                                    <Button
                                        variant="contained"
                                        sx={{ marginRight: 2, background: "white !important", color: "black !important" }}
                                        onClick={handleSearch}
                                    >
                                        <SearchIcon /> Search
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ background: "white !important", color: "black !important" }}
                                        onClick={handleOpenModal}
                                    >
                                        <AddIcon /> Add Customer
                                    </Button>
                                </MDBox>
                            </MDBox>
                            <MDBox pt={3} px={3} pb={1}>
                                <ThemeProvider theme={theme}>
                                    <div style={{ height: 400, width: '100%' }}>

                                        <DataGrid
                                            rows={filteredRows}
                                            columns={columns}
                                            initialState={{
                                                pagination: {
                                                    paginationModel: { pageSize: limit, page },
                                                },
                                            }}
                                            paginationMode='server'
                                            rowCount={total}
                                            pageSize={limit}
                                            // checkboxSelection
                                            onPaginationModelChange={(value) => {
                                                if (value.pageSize !== limit) {
                                                    changeLimit(value.pageSize);
                                                    return changePage(0);
                                                }
                                                changePage(value.page);
                                                changeLimit(value.pageSize);
                                            }}
                                            disableSelectionOnClick
                                            loading={loading}
                                        />
                                    </div>
                                </ThemeProvider>
                            </MDBox>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        {renderSuccessSB}
                    </Grid>
                </Grid>
            </MDBox>
            <CustomerModal
                open={openModal}
                handleClose={handleCloseModal}
                openSuccessSB={openSuccessSB}
                setFilteredRows={setFilteredRows}
                changeTotal={changeTotal}
            />
            <LoanModal
                open={loanModalOpen}
                handleClose={handleCloseLoanModal}
                customerId={selectedCustomerId}
            />
            <Footer />

        </DashboardLayout>
    );
}

export default Customers;
