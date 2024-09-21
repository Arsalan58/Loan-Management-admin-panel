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
import { Button, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import moment from "moment";
import CustomerModal from "../../components/CustomerModal";
import LoanModal from "../../components/LoanModal";
import { usePagination } from "hooks/usePagination";
import { BASE_URL } from "constants";
import Footer from "examples/Footer";
import { Edit } from "@mui/icons-material";

function Customers() {
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const { page, limit, total, changePage, changeLimit, changeTotal } = usePagination();
    const [successSB, setSuccessSB] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [loanModalOpen, setLoanModalOpen] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [editable, setEditable] = useState(false);
    const [initialState, setInitialState] = useState({});
    const openSuccessSB = (status, title) => setSuccessSB({ status, title });
    const closeSuccessSB = () => setSuccessSB({});

    const handleOpenModal = () => {
        setInitialState({}); // Reset initial state when creating a new customer
        setEditable(false);  // Ensure it's set to non-editable
        setOpenModal(true);
    };

    const handleEditCustomer = (rowData) => {
        setInitialState(rowData);  // Pre-fill the form with the selected customer data
        setEditable(true);         // Enable editing mode
        setOpenModal(true);        // Open the modal
    };

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
            color={successSB.status === "success" ? "success" : successSB.status === "error" ? "warning" : "dark"}
            icon={successSB.status === "success" ? "check" : successSB.status === "error" ? "warning" : ""}
            title={successSB.status ? successSB.status : ""}
            content={successSB.title ? successSB.title : ""}
            dateTime="1 min ago"
            open={Boolean(successSB.status)}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite
        />
    );

    const columns = [
        { field: 'custId', headerName: 'Cx Id', width: 110,  },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'mobile', headerName: 'Mobile', width: 150 },
        { field: 'PAN', headerName: 'PAN', width: 150 },
        { field: 'Aadhaar', headerName: 'Aadhaar', width: 150 },
        { field: 'address', headerName: 'Address', width: 200 },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleOpenLoanModal(params.row.id)}
                >
                    Create Loan
                </Button>
            ),
        },
        {
            field: 'edit',
            headerName: 'Edit',
            disableColumnMenu: true,
            sortable: false,
            width: 70,
            renderCell: (params) => (
                <IconButton aria-label="edit" onClick={() => handleEditCustomer(params.row)}>
                    <Edit />
                </IconButton>
            ),
        },
    ];

    const fetchCustomers = async (query = "") => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/web/retrieve/customers`, {
                params: { page, limit, search: query },
                headers: { "Authorization": localStorage.getItem("token") }
            });
            if (response.data.type === "success") {
                openSuccessSB(response.data.type, response.data.message);
                setFilteredRows(response.data.data.data);
                changeTotal(response.data.data.total);
            } else {
                openSuccessSB(response.data.type, response.data.message);
            }
        } catch (err) {
            console.error(err);
            openSuccessSB("error", err.message);
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
                                        sx={{ marginRight: 1, backgroundColor: "white !important", borderRadius: "4px !important" }}
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
                                            disableRowSelectionOnClick
                                        />
                                    </div>
                                </ThemeProvider>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            {renderSuccessSB}
            <CustomerModal
                open={openModal}
                handleClose={handleCloseModal}
                openSuccessSB={openSuccessSB}
                isEditMode={editable}
                initialData={initialState}
                setFilteredRows={setFilteredRows}
                changeTotal={changeTotal}
            />
            <LoanModal
                open={loanModalOpen}
                openSuccessSB={openSuccessSB}
                handleClose={handleCloseLoanModal}
                customerId={selectedCustomerId}
            />            <Footer />
        </DashboardLayout>
    );
}

export default Customers;
