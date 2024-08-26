import React, { useEffect, useState } from "react";
import { MenuItem, Select } from "@mui/material";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDSnackbar from "components/MDSnackbar";
import MDButton from "components/MDButton";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { BASE_URL } from "constants";
import moment from "moment";
import FieldOfficerModal from "../../components/FieldOfficerModal";
import { usePagination } from "hooks/usePagination";

function FieldOfficer() {
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const { page, limit, total, changePage, changeLimit, changeTotal } = usePagination();
    const [successSB, setSuccessSB] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [content, setContent] = useState("");

    const openSuccessSB = (title) => setSuccessSB(title);
    const closeSuccessSB = () => setSuccessSB(false);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const theme = createTheme({
        palette: {
            primary: { main: "#1976d2" },
            secondary: { main: "#d32f2f" },
            success: { main: "#2e7d32" },
        },
        typography: { fontFamily: "Roboto,Helvetica, Arial, sans-serif" },
        components: {
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        backgroundColor: "#f4f6f8",
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#1976d2",
                            fontSize: "1.1rem",
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

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/web/status/field-officer`, { status: newStatus }, {
                params: { id }
            });
            if (response.data.type === "success") {
                openSuccessSB("Status updated successfully");
                setFilteredRows((prevRows) =>
                    prevRows.map((row) => (row.id === id ? { ...row, status: newStatus } : row))
                );
            } else {
                openSuccessSB("Error", "Failed to update status");
            }
        } catch (err) {
            console.error(err);
            openSuccessSB("Error", "An error occurred while updating the status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return "#4caf50"; // Green for Active
            case "Inactive":
                return "#ff9800"; // Orange for Inactive
            case "Suspended":
                return "#f44336"; // Red for Suspended
            default:
                return "#9e9e9e"; // Grey as fallback
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "name", headerName: "Name", width: 150 },
        { field: "mobile", headerName: "Mobile", width: 150 },
        { field: "assignedArea", headerName: "Assigned Area", width: 150 },
        {
            field: "status",
            headerName: "Status",
            width: 150,
            renderCell: (params) => (
                <Select
                    value={params.value}
                    onChange={(event) => handleStatusChange(params.row.id, event.target.value)}
                    variant="outlined"
                    sx={{
                        width: "100%",
                        backgroundColor: getStatusColor(params.value),
                        color: "white",
                        fontWeight: "bold",
                        "& .MuiSelect-select": {
                            padding: "8px",
                        },
                        "&:hover": {
                            backgroundColor: getStatusColor(params.value),
                        },
                    }}
                >
                    <MenuItem value="Active" sx={{
                        "&:hover": {
                            backgroundColor: getStatusColor(params.value),
                        }, backgroundColor: "#4caf50", color: "white", fontWeight: "bold"
                    }}>
                        Active
                    </MenuItem>
                    <MenuItem value="Inactive" sx={{
                        "&:hover": {
                            backgroundColor: getStatusColor(params.value),
                        }, backgroundColor: "#ff9800", color: "white", fontWeight: "bold"
                    }}>
                        Inactive
                    </MenuItem>
                    <MenuItem value="Suspended" sx={{
                        "&:hover": {
                            backgroundColor: getStatusColor(params.value),
                        }, backgroundColor: "#f44336", color: "white", fontWeight: "bold"
                    }}>
                        Suspended
                    </MenuItem>
                </Select>
            ),
        },
        {
            field: "createdAt",
            headerName: "Created At",
            width: 200,
            valueFormatter: (params) => moment(params).format("YYYY:MM:DD HH:mm:ss"),
        },
        {
            field: "updatedAt",
            headerName: "Updated At",
            width: 200,
            valueFormatter: (params) => moment(params).format("YYYY:MM:DD hh:mm:ss"),
        },
    ];

    useEffect(() => {
        const fetchFieldOfficers = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/api/web/retrieve/field-officers`, {
                    params: { page, limit },
                });
                if (response.data.type === "success") {
                    openSuccessSB(response.data.message);
                    setFilteredRows(response.data.data.data);
                    changeTotal(response.data.data.total);
                } else {
                    setContent("Failed to retrieve field officers.");
                    openSuccessSB("Error");
                }
            } catch (err) {
                console.error(err);
                setContent("An error occurred while fetching field officers.");
                openSuccessSB("Error");
            }
            setLoading(false);
        };
        fetchFieldOfficers();
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
                                    Field Officers Table
                                </MDTypography>
                                <Button
                                    variant="contained"
                                    sx={{ background: "white !important", color: "black !important" }}
                                    onClick={handleOpenModal}
                                >
                                    <AddIcon /> Field Officer
                                </Button>
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
            <FieldOfficerModal
                open={openModal}
                handleClose={handleCloseModal}
                openSuccessSB={openSuccessSB}
                setFilteredRows={setFilteredRows}
                changeTotal={changeTotal}
            />
            <Footer/>
        </DashboardLayout>
    );
}

export default FieldOfficer;
