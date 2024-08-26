import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import axios from "axios";
import { BASE_URL } from "constants";
import DataTable from "examples/Tables/DataTable";
import moment from "moment-timezone";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const DetailDialog = ({ open, onClose, details, type, refetch }) => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [openPenaltiesModal, setOpenPenaltiesModal] = useState(false);
    const [penaltiesData, setPenaltiesData] = useState([]);
    const [penaltiesColumns, setPenaltiesColumns] = useState([]);
    const [currentEmiId, setCurrentEmiId] = useState(null);

    const handleViewPenalties = async (emiId) => {
        if (!details) return;

        setCurrentEmiId(emiId);

        try {
            const response = await axios.get(`${BASE_URL}/api/web/retrieve/penalties?emiId=${emiId}`);
            const penalties = response.data.data?.map((item) => ({
                ...item,
                createdAt: moment(item.createdAt).utc().format("YYYY-MM-DD HH:mm:ss"),
            }));

            setPenaltiesData(penalties || []);
            setPenaltiesColumns([
                { Header: "Penalty ID", accessor: "id" },
                { Header: "Amount", accessor: "amount" },
                { Header: "Reason", accessor: "reason" },
                { Header: "Status", accessor: "status" },
                { Header: "Created At", accessor: "createdAt" },
            ]);
            setOpenPenaltiesModal(true);
        } catch (error) {
            console.error("Failed to fetch penalties", error);
        }
    };

    const handleClosePenaltiesModal = () => {
        setOpenPenaltiesModal(false);
        setCurrentEmiId(null); // Clear the current EMI ID when closing the modal
    };

    const handleClose = () => {
        onClose();
        // Reset data and columns
        setData([]);
        setColumns([]);
        setPenaltiesData([]);
        setPenaltiesColumns([]);
    };

    useEffect(() => {
        if (!open) {
            // Reset state when modal is closed
            setData([]);
            setColumns([]);
            setPenaltiesData([]);
            setPenaltiesColumns([]);
        }
    }, [open]);

    useEffect(() => {
        const fetchData = async () => {
            if (!details) return;

            let response;
            switch (type) {
                case 'Customer':
                    response = await axios.get(`${BASE_URL}/api/web/retrieve/customer`, {
                        params: { id: details.customerId },
                        headers: {
                            "Authorization": localStorage.getItem("token")
                        }
                    });
                    setData([response.data.data]); // Assuming data comes as an object
                    setColumns([
                        { Header: 'Customer ID', accessor: 'id' },
                        { Header: 'Name', accessor: 'name' },
                        { Header: 'Mobile', accessor: 'mobile' },
                        { Header: 'PAN', accessor: 'PAN' },
                        { Header: 'Aadhaar', accessor: 'Aadhaar' },
                    ]);
                    break;
                case 'FieldOfficer':
                    response = await axios.get(`${BASE_URL}/api/web/retrieve/field-officer`, {
                        params: { id: details.fieldOfficerId },
                        headers: {
                            "Authorization": localStorage.getItem("token")
                        }
                    });
                    setData([response.data.data]);
                    setColumns([
                        { Header: 'Officer ID', accessor: 'id' },
                        { Header: 'Name', accessor: 'name' },
                        { Header: 'Mobile', accessor: 'mobile' },
                        { Header: 'Assigned Area', accessor: 'assignedArea' },
                    ]);
                    break;
                case 'EMI':
                    response = await axios.get(`${BASE_URL}/api/web/retrieve/emis`, {
                        params: { loanId: details.id },
                    });
                    const emis = response.data.data.map((emi) => ({
                        ...emi,
                        dueDate: moment(emi.dueDate).format("YYYY-MM-DD"),
                    }));
                    setData(emis);
                    setColumns([
                        { Header: 'EMI ID', accessor: 'id' },
                        { Header: 'Amount', accessor: 'amount' },
                        { Header: 'Penalty', accessor: 'penalty' },
                        { Header: 'Due Date', accessor: 'dueDate' },
                        {
                            Header: 'Status', accessor: 'status', Cell: ({ row }) => (
                                <Chip label={row.original.status} color={row.original.status == "Paid" ? "success" : "primary"} />
                            ),
                        },
                        {
                            Header: 'Actions',
                            accessor: 'actions',
                            Cell: ({ row }) => (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    onClick={() => handleViewPenalties(row.original.id)}
                                    sx={{color:"white !important"}}
                                >
                                    View Penalties
                                </Button>
                            ),
                        },
                    ]);
                    break;
                case 'Penalties':
                    try {
                        response = await axios.get(`${BASE_URL}/api/web/retrieve/penalties?loanId=${details.id}`);
                        const penalties = response.data.data?.map((item) => ({
                            ...item,
                            createdAt: moment(item.createdAt).utc().format("YYYY-MM-DD HH:mm:ss"),
                        }));
                        setData(penalties || []);
                        setColumns([
                            { Header: "Penalty ID", accessor: "id" },
                            { Header: "Amount", accessor: "amount" },
                            { Header: "Reason", accessor: "reason" },
                            { Header: "Status", accessor: "status" },
                            { Header: "Created At", accessor: "createdAt" },
                        ]);


                    } catch (error) {
                        console.error("Failed to fetch penalties", error);
                    }
                    break;
                case 'Guarantor':
                    try {
                        response = await axios.get(`${BASE_URL}/api/web/retrieve/guarantor?guarantorId=${details.guarantorId}`,{
                            headers:{
                                "Authorization":localStorage.getItem("token")
                            }
                        });
                        console.log(response)
                        // const guarantor = response.data.data?.map((item) => ({
                        //     ...item,
                        //     createdAt: moment(item.createdAt).utc().format("YYYY-MM-DD HH:mm:ss"),
                        // }));
                        setData(response.data.data ? [response.data.data] : []);
                        setColumns([
                            { Header: "Name", accessor: "name" },
                            { Header: "Mobile", accessor: "mobile" },
                            { Header: "PAN", accessor: "PAN" },
                            { Header: "Aadhaar", accessor: "Aadhaar" },
                        ]);


                    } catch (error) {
                        console.error("Failed to fetch penalties", error);
                    }
                    break;
                default:
                    break;
            }
        };

        fetchData();
    }, [details, type, refetch]);

    return (
        <>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>{type} Details</DialogTitle>
                <DialogContent>
                    <Box sx={{ padding: 2 }}>
                        <Divider sx={{ mb: 2 }} />
                        {data?.length === 0 ? (
                            <Typography>No details available</Typography>
                        ) : (
                            <DataTable
                                entriesPerPage={{ defaultValue: 10 }}
                                canSearch
                                showTotalEntries
                                table={{ columns, rows: data }}
                                pagination={{ variant: "gradient", color: "info" }}
                                isSorted={false}
                                noEndBorder
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Penalties Modal */}
            <Dialog open={openPenaltiesModal} onClose={handleClosePenaltiesModal} fullWidth maxWidth="md">
                <DialogTitle>Penalties</DialogTitle>
                <DialogContent>
                    <Box sx={{ padding: 2 }}>
                        {penaltiesData?.length === 0 ? (
                            <Typography>No penalties available</Typography>
                        ) : (
                            <DataTable
                                entriesPerPage={{ defaultValue: 10 }}
                                canSearch
                                showTotalEntries
                                table={{ columns: penaltiesColumns, rows: penaltiesData }}
                                pagination={{ variant: "gradient", color: "info" }}
                                isSorted={false}
                                noEndBorder
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePenaltiesModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DetailDialog;
