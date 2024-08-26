import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDSnackbar from "components/MDSnackbar";
import { Button, Chip, IconButton, Menu, MenuItem, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { BASE_URL } from "constants";
import moment from "moment";
import DetailDrawer from "components/detailsDrawer";
import { usePagination } from "hooks/usePagination";
import LoanModal from "components/LoanModal";

function LoanManagementPage() {
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successSB, setSuccessSB] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [content, setContent] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [drawerContent, setDrawerContent] = useState({});
    const [drawerType, setDrawerType] = useState("");
    const [openDrawer, setOpenDrawer] = useState(false);
    const [search, setSearch] = useState("");
    const [refetch, setRefetch] = useState(new Date());

    const { page, limit, total, changePage, changeLimit, changeTotal } = usePagination();

    const openSuccessSB = (title) => setSuccessSB(title);
    const closeSuccessSB = () => setSuccessSB(false);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleClickMenu = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleCloseMenu = () => setAnchorEl(null);

    const handleMenuItemClick = (action) => {
        setRefetch(new Date());
        handleCloseMenu();
        if (!selectedRow) return;

        setDrawerContent(selectedRow);
        setDrawerType(action);
        setOpenDrawer(true);
    };

    const handleSearchChange = (event) => setSearch(event.target.value);

    const handleSearchClick = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/web/retrieve/loans`, {
                params: { page, limit, search },
            });
            if (response.data.type === "success") {
                openSuccessSB(response.data.message);
                setFilteredRows(response.data.data.data);
                changeTotal(response.data.data.total);
            } else {
                setContent("Failed to retrieve loans.");
                openSuccessSB("Error");
                setFilteredRows([]);
            }
        } catch (err) {
            console.error(err);
            setContent("An error occurred while fetching loans.");
            openSuccessSB("Error");
            setFilteredRows([]);
        }
        setLoading(false);
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
        { field: 'id', headerName: 'Loan ID', flex: 1 },
        { field: 'amount', headerName: 'Principal Amount', flex: 1 },
        { field: 'interestRate', headerName: 'Interest Rate', flex: 1 },
        // { field: 'EMIPlanId', headerName: 'EMI Plan', flex: 1 },
        {
            field: 'status', headerName: 'Status', flex: 1, renderCell: (params) => (
                <Chip label={params.row.status} size="small" variant="contained" color={params.row.status == "Active" ? "success": "warning"}/>
            ),
        },
        // { field: 'fieldOfficerId', headerName: 'Field Officer ID', flex: 1 },
        {
            field: 'createdAt', headerName: 'Created On', flex: 1, valueFormatter: (value) => moment(value).format("YYYY MMM DD"),
        },
        {
            field: 'action',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <IconButton
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={(event) => { event.stopPropagation(); handleClickMenu(event, params.row) }}
                >
                    <MoreVertIcon />
                </IconButton>
            ),
        },
    ];

    useEffect(() => {
        handleSearchClick();
    }, [page, limit]);

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
                                    Loans Table
                                </MDTypography>
                                <Button
                                    variant="contained"
                                    sx={{ background: "white !important", color: "black !important" }}
                                    onClick={handleOpenModal}
                                >
                                    <AddIcon /> Add Loan
                                </Button>
                            </MDBox>
                            <MDBox pt={3} px={3} pb={1}>
                                <Grid container spacing={2} mb={2} alignItems="center">
                                    <Grid item xs={4} sm={4}>
                                        <TextField
                                            label="Search by Mobile Number or PAN"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={search}
                                            onChange={handleSearchChange}
                                        />
                                    </Grid>
                                    <Grid item xs={1} sm={1}>
                                        <Button
                                            variant="contained"
                                            onClick={handleSearchClick}
                                            sx={{ bgcolor: "#2881ea", color: "white !important" }}
                                            fullWidth
                                        >
                                            Search
                                        </Button>
                                    </Grid>
                                </Grid>
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
                                            paginationMode="server"
                                            rowCount={total}
                                            pageSize={limit}
                                            checkboxSelection
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
            <LoanModal
                open={openModal}
                handleClose={handleCloseModal}
                openSuccessSB={openSuccessSB}
                setFilteredRows={setFilteredRows}
                changeTotal={changeTotal}
            />
            <DetailDrawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                details={drawerContent}
                type={drawerType}
                refetch={refetch}
            />
            <Footer />
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={() => handleMenuItemClick('Customer')}>View Customer Details</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('Guarantor')}>View Guarantor Details</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('FieldOfficer')}>View Field Officer Details</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('EMI')}>View EMI Details</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('SettledLoans')}>View Settled Loans</MenuItem>
            </Menu>
        </DashboardLayout>
    );
}

export default LoanManagementPage;
