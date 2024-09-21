// import React, { useEffect, useState } from "react";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import Button from "@mui/material/Button";
// import Divider from "@mui/material/Divider";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import Chip from "@mui/material/Chip";
// import axios from "axios";
// import { BASE_URL } from "constants";
// import moment from "moment-timezone";
// import { DataGrid } from '@mui/x-data-grid';
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { usePagination } from "hooks/usePagination";
// import { Checkbox, CircularProgress, TextField } from "@mui/material";
// const DetailDialog = ({ open, onClose, details, type, refetch }) => {
//     const [data, setData] = useState([]);
//     const [columns, setColumns] = useState([]);
//     const [openPenaltiesModal, setOpenPenaltiesModal] = useState(false);
//     const [penaltiesData, setPenaltiesData] = useState([]);
//     const [penaltiesColumns, setPenaltiesColumns] = useState([]);
//     const [currentEmiId, setCurrentEmiId] = useState(null);

//     const { page, limit, total, changePage, changeLimit, changeTotal } = usePagination();
//     const [numEmisToSettle, setNumEmisToSettle] = useState('');
// const [description, setDescription] = useState('');

// const toggleEmiSelection = (emiId) => {
//     setData((prevData) =>
//         prevData.map((emi) =>
//             emi.id === emiId ? { ...emi, selected: !emi.selected } : emi
//         )
//     );
// };

// const handleSettleEmis = async (e) => {
//     e.preventDefault();

//     const selectedEmis = data.filter((emi) => emi.selected);

//     if (selectedEmis.length === 0) {
//         alert("Please select at least one EMI to settle.");
//         return;
//     }

//     try {
//         await axios.post(`${BASE_URL}/api/web/settle/previous-emis`, {
//             emis: selectedEmis.map((emi) => emi.id),
//             description,
//             numEmisToSettle,
//         }, {
//             headers: {
//                 "Authorization": localStorage.getItem("token"),
//             },
//         });

//         // Refetch or update data as necessary after successful settlement
//         refetch();
//         handleClose(); // Close the dialog after settlement
//     } catch (error) {
//         console.error("Failed to settle previous EMIs", error);
//     }
// };


//     const handleViewPenalties = async (emiId) => {
//         if (!details) return;

//         setCurrentEmiId(emiId);

//         try {
//             const response = await axios.get(`${BASE_URL}/api/web/retrieve/penalties?emiId=${emiId}`);
//             const penalties = response.data.data?.map((item) => ({
//                 ...item,
//                 createdAt: moment(item.createdAt).utc().format("YYYY-MM-DD HH:mm:ss"),
//             }));

//             setPenaltiesData(penalties || []);
//             setPenaltiesColumns([
//                 { field: "id", headerName: "Penalty ID", flex: 1 },
//                 { field: "amount", headerName: "Amount", flex: 1 },
//                 { field: "reason", headerName: "Reason", flex: 1 },
//                 { field: "status", headerName: "Status", flex: 1 },
//                 { field: "createdAt", headerName: "Created At", flex: 1 },
//             ]);
//             setOpenPenaltiesModal(true);
//         } catch (error) {
//             console.error("Failed to fetch penalties", error);
//         }
//     };

//     const handleClosePenaltiesModal = () => {
//         setOpenPenaltiesModal(false);
//         setCurrentEmiId(null); // Clear the current EMI ID when closing the modal
//     };

//     const handleClose = () => {
//         onClose();
//         // Reset data and columns
//         setData([]);
//         setColumns([]);
//         setPenaltiesData([]);
//         setPenaltiesColumns([]);
//     };

//     useEffect(() => {
//         if (!open) {
//             // Reset state when modal is closed
//             setData([]);
//             setColumns([]);
//             setPenaltiesData([]);
//             setPenaltiesColumns([]);
//         }
//     }, [open]);

//     useEffect(() => {
//         const fetchData = async () => {
//             if (!details) return;

//             let response;
//             switch (type) {
//                 case 'Customer':
//                     response = await axios.get(`${BASE_URL}/api/web/retrieve/customer`, {
//                         params: { id: details.customerId },
//                         headers: {
//                             "Authorization": localStorage.getItem("token")
//                         }
//                     });
//                     setData([response.data.data]); // Assuming data comes as an object
//                     setColumns([
//                         { field: 'id', headerName: 'Customer ID', flex: 1 },
//                         { field: 'name', headerName: 'Name', flex: 1 },
//                         { field: 'mobile', headerName: 'Mobile', flex: 1 },
//                         { field: 'PAN', headerName: 'PAN', flex: 1 },
//                         { field: 'Aadhaar', headerName: 'Aadhaar', flex: 1 },
//                     ]);
//                     break;
//                 case 'FieldOfficer':
//                     response = await axios.get(`${BASE_URL}/api/web/retrieve/field-officer`, {
//                         params: { id: details.fieldOfficerId },
//                         headers: {
//                             "Authorization": localStorage.getItem("token")
//                         }
//                     });
//                     setData([response.data.data]);
//                     setColumns([
//                         { field: 'id', headerName: 'Officer ID', flex: 1 },
//                         { field: 'name', headerName: 'Name', flex: 1 },
//                         { field: 'mobile', headerName: 'Mobile', flex: 1 },
//                         { field: 'assignedArea', headerName: 'Assigned Area', flex: 1 },
//                     ]);
//                     break;
//                 case 'EMI':
//                     response = await axios.get(`${BASE_URL}/api/web/retrieve/emis`, {
//                         params: { loanId: details.id, page, limit },
//                     });
//                     const emis = response.data.data.data.map((emi) => ({
//                         ...emi,
//                         dueDate: moment(emi.dueDate).format("YYYY-MM-DD"),
//                     }));
//                     setData(emis);
//                     setColumns([
//                         { field: 'id', headerName: 'EMI ID', flex: 1 },
//                         { field: 'amount', headerName: 'Amount', flex: 1 },
//                         { field: 'penalty', headerName: 'Penalty', flex: 1 },
//                         { field: 'dueDate', headerName: 'Due Date', flex: 1 },
//                         {
//                             field: 'status', headerName: 'Status', flex: 1, renderCell: (params) => (
//                                 <Chip label={params.value} color={params.value === "Paid" ? "success" : "primary"} />
//                             ),
//                         },
//                         {
//                             field: 'actions',
//                             headerName: 'Actions',
//                             renderCell: (params) => (
//                                 <Button
//                                     variant="contained"
//                                     color="secondary"
//                                     size="small"
//                                     onClick={() => handleViewPenalties(params.row.id)}
//                                     sx={{ color: "white !important" }}
//                                 >
//                                     View Penalties
//                                 </Button>
//                             ),
//                             flex: 1,
//                         },
//                     ]);

//                     // Update the total count for pagination
//                     changeTotal(response.data.data.count);
//                     break;
//                 case 'Penalties':
//                     try {
//                         response = await axios.get(`${BASE_URL}/api/web/retrieve/penalties?loanId=${details.id}`);
//                         const penalties = response.data.data?.map((item) => ({
//                             ...item,
//                             createdAt: moment(item.createdAt).utc().format("YYYY-MM-DD HH:mm:ss"),
//                         }));
//                         setData(penalties || []);
//                         setColumns([
//                             { field: "id", headerName: "Penalty ID", flex: 1 },
//                             { field: "amount", headerName: "Amount", flex: 1 },
//                             { field: "reason", headerName: "Reason", flex: 1 },
//                             { field: "status", headerName: "Status", flex: 1 },
//                             { field: "createdAt", headerName: "Created At", flex: 1 },
//                         ]);
//                     } catch (error) {
//                         console.error("Failed to fetch penalties", error);
//                     }
//                     break;
//                 case 'Guarantor':
//                     try {
//                         response = await axios.get(`${BASE_URL}/api/web/retrieve/guarantor?guarantorId=${details.guarantorId}`, {
//                             headers: {
//                                 "Authorization": localStorage.getItem("token")
//                             }
//                         });
//                         setData(response.data.data ? [response.data.data] : []);
//                         setColumns([
//                             { field: "name", headerName: "Name", flex: 1 },
//                             { field: "mobile", headerName: "Mobile", flex: 1 },
//                             { field: "PAN", headerName: "PAN", flex: 1 },
//                             { field: "Aadhaar", headerName: "Aadhaar", flex: 1 },
//                         ]);
//                     } catch (error) {
//                         console.error("Failed to fetch guarantor", error);
//                     }
//                     break;
//                 case 'Settle remaining Emis':
//                     try {
//                         response = await axios.get(`${BASE_URL}/api/web/retrieve/remaining-emis`, {
//                             params: { loanId: details.loanId },
//                             headers: {
//                                 "Authorization": localStorage.getItem("token"),
//                             },
//                         });
//                         const remainingEmis = response.data.data?.map((emi) => ({
//                             ...emi,
//                             dueDate: moment(emi.dueDate).format("YYYY-MM-DD"),
//                         }));
//                         setData(remainingEmis || []);
//                         setColumns([
//                             { field: "id", headerName: "EMI ID", flex: 1 },
//                             { field: "amount", headerName: "Amount", flex: 1 },
//                             { field: "dueDate", headerName: "Due Date", flex: 1 },
//                             { field: "status", headerName: "Status", flex: 1 },
//                         ]);
//                     } catch (error) {
//                         console.error("Failed to fetch remaining EMIs", error);
//                     }
//                     break;
//                 case 'Settle previous Emis':
//                     try {
//                         response = await axios.get(`${BASE_URL}/api/web/retrieve/previous-emis`, {
//                             params: { loanId: details.id },
//                             headers: {
//                                 "Authorization": localStorage.getItem("token"),
//                             },
//                         });
//                         const previousEmis = response.data.data.data?.map((emi) => ({
//                             ...emi,
//                             dueDate: moment(emi.dueDate).format("YYYY-MM-DD"),
//                         }));
//                         console.log( response.data.data)
//                         setData(previousEmis || []);
//                         setColumns([
//                             { field: "id", headerName: "EMI ID", flex: 1 },
//                             { field: "amount", headerName: "Amount", flex: 1 },
//                             { field: "dueDate", headerName: "Due Date", flex: 1 },
//                             { field: "status", headerName: "Status", flex: 1 },
//                         ]);

//                         // Add checkboxes to each row
//                         setData(previousEmis.map((emi) => ({
//                             ...emi,
//                             selected: false, // Add a selected property for checkboxes
//                         })));

//                     } catch (error) {
//                         console.error("Failed to fetch previous EMIs", error);
//                     }
//                     break;

//                 default:
//                     break;
//             }
//         };

//         fetchData();
//     }, [details, type, refetch, page, limit]); // Added page and limit to the dependency array

//     const theme = createTheme({
//         palette: {
//             primary: { main: '#1976d2' },
//             secondary: { main: '#d32f2f' },
//             success: { main: '#2e7d32' },
//         },
//         typography: {
//             fontFamily: "Roboto, Helvetica, Arial, sans-serif",
//         },
//         components: {
//             MuiDataGrid: {
//                 styleOverrides: {
//                     root: {
//                         backgroundColor: '#f4f6f8',
//                         '& .MuiDataGrid-columnHeaders': {
//                             backgroundColor: '#1976d2',
//                             fontSize: '1.1rem',
//                         },
//                     },
//                 },
//             },
//         },
//     });

//     const calculateHeight = (rowCount) => {
//         const rowHeight = 52; // Default row height in DataGrid
//         const headerHeight = 56; // Default header height in DataGrid
//         return rowCount * rowHeight + headerHeight;
//     };

//     return (
//         <ThemeProvider theme={theme}>

//             <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
//                 <DialogTitle>{type} Details</DialogTitle>
//                 <DialogContent>
//                     <Box sx={{ padding: 2 }}>
//                         <Divider sx={{ mb: 2 }} />

//                         {/* Form for settling previous EMIs */}
//                         <Box component="form" onSubmit={handleSettleEmis} sx={{ mb: 3 }}>
//                             <TextField
//                                 label="Number of EMIs"
//                                 fullWidth
//                                 variant="outlined"
//                                 margin="normal"
//                                 value={numEmisToSettle}
//                                 onChange={(e) => setNumEmisToSettle(e.target.value)}
//                             />
//                             <TextField
//                                 label="Description"
//                                 fullWidth
//                                 variant="outlined"
//                                 margin="normal"
//                                 multiline
//                                 rows={4}
//                                 value={description}
//                                 onChange={(e) => setDescription(e.target.value)}
//                             />
//                             <Button type="submit" variant="contained" color="primary" fullWidth>
//                                 Settle Selected EMIs
//                             </Button>
//                         </Box>

//                         {/* EMI selection using checkboxes */}
//                         {data.length === 0 ? (
//                             <Typography>No previous EMIs available</Typography>
//                         ) : (
//                             <Box>
//                                 {data.map((emi) => (
//                                     <Box key={emi.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                                         <Checkbox
//                                             checked={emi.selected}
//                                             onChange={() => toggleEmiSelection(emi.id)}
//                                         />
//                                         <Typography>
//                                             EMI ID: {emi.id}, Amount: {emi.amount}, Due Date: {emi.dueDate}
//                                         </Typography>
//                                     </Box>
//                                 ))}
//                             </Box>
//                         )}
//                     </Box>
//                 </DialogContent>

//                 <DialogActions>
//                     <Button onClick={handleClose} variant="contained" color="secondary">
//                         Close
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Penalties Modal */}
//             <Dialog open={openPenaltiesModal} onClose={handleClosePenaltiesModal} fullWidth maxWidth="md">
//                 <DialogTitle>Penalties Details</DialogTitle>
//                 <DialogContent>
//                     <Box sx={{ padding: 2 }}>
//                         <Divider sx={{ mb: 2 }} />
//                         {penaltiesData?.length === 0 ? (
//                             <Typography>No penalties available</Typography>
//                         ) : (
//                             <div style={{ height: 400, width: '100%' }}>
//                                 <DataGrid
//                                     rows={penaltiesData}
//                                     columns={penaltiesColumns}
//                                     initialState={{
//                                         pagination: {
//                                             paginationModel: { pageSize: limit, page },
//                                         },
//                                     }}
//                                     paginationMode="server"
//                                     page={page - 1}
//                                     pageSize={limit}
//                                     rowCount={total}
//                                     onPaginationModelChange={(value) => {
//                                         if (value.pageSize !== limit) {
//                                             changeLimit(value.pageSize);
//                                             return changePage(0);
//                                         }
//                                         changePage(value.page);
//                                         changeLimit(value.pageSize);
//                                     }}
//                                     disableRowSelectionOnClick
//                                 />
//                                 {/* <DataGrid
//                                     rows={penaltiesData}
//                                     columns={penaltiesColumns}
//                                     hideFooter
//                                     disableRowSelectionOnClick
//                                 /> */}
//                             </div>
//                         )}
//                     </Box>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClosePenaltiesModal} variant="contained" color="secondary">
//                         Close
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </ThemeProvider>
//     );
// };

// export default DetailDialog;



import React, { useEffect, useRef, useState } from "react";
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
import moment from "moment-timezone";
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { usePagination } from "hooks/usePagination";
import { Card, CardContent, Checkbox, CircularProgress, FormControlLabel, Grid, MenuItem, Pagination, Select, TextField } from "@mui/material";
import ReactToPrint from "react-to-print";
import { Email, LocationOn, Phone } from "@mui/icons-material";
import { useFormik } from "formik";
// import {logo} from "../../public/logo.png"

const DetailDialog = ({ open, onClose, details, type, refetch, openSuccessSB, }) => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [openPenaltiesModal, setOpenPenaltiesModal] = useState(false);
    const [penaltiesData, setPenaltiesData] = useState([]);
    const [penaltiesColumns, setPenaltiesColumns] = useState([]);
    const [currentEmiId, setCurrentEmiId] = useState(null);
    // const [numEmisToSettle, setNumEmisToSettle] = useState('');
    const [description, setDescription] = useState('');
    const [loader, setLoader] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(false);

    const { page, limit, total, changePage, changeLimit, changeTotal } = usePagination();
    const { page: page2, limit: limit2, total: total2, changePage: changePage2, changeLimit: changeLimit2, changeTotal: changeTotal2 } = usePagination();
    // const [page, setPage] = useState(1); // Current page
    const itemsPerPage = 5; // Items per page
    const paginatedData = data;

    const handlePageChange = (event, value) => {
        console.log(value)
        changePage2(value);
    };

    const handleViewPenalties = async (emiId) => {
        if (!details) return;

        setCurrentEmiId(emiId);

        try {
            const response = await axios.get(`${BASE_URL}/api/web/retrieve/penalties?emiId=${emiId}`, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
            const penalties = response.data.data?.map((item) => ({
                ...item,
                createdAt: moment(item.createdAt).utc().format("YYYY-MM-DD HH:mm:ss"),
            }));

            setPenaltiesData(penalties || []);
            setPenaltiesColumns([
                { field: "id", headerName: "Penalty ID", flex: 1 },
                { field: "amount", headerName: "Amount", flex: 1 },
                { field: "reason", headerName: "Reason", flex: 1 },
                { field: "status", headerName: "Status", flex: 1 },
                { field: "createdAt", headerName: "Created At", flex: 1 },
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
        setDescription("")
        setData([]);
        setSelectAll(null)
        setColumns([]);
        setPenaltiesData([]);
        setPenaltiesColumns([]);
    };

    const toggleEmiSelection = (emiId) => {
        setData((prevData) =>
            prevData?.map((emi) =>
                emi.id === emiId ? { ...emi, selected: !emi.selected } : emi
            )
        );
    };

    const toggleSelectAll = () => {
        setSelectAll(!selectAll);
        setData((prevData) =>
            prevData?.map((emi) => ({ ...emi, selected: !selectAll }))
        );
    };

    const handleSettleEmis = async (e) => {
        // openSuccessSB("error")

        e.preventDefault();
        // console.log(type === "Settle remaining Emis")
        const selectedEmis = data.filter((emi) => emi.selected);
        console.log(selectedEmis)

        if (selectedEmis.length === 0) {
            // alert("Please select at least one EMI to settle.");
            openSuccessSB("error", "Please select at least one EMI to settle.")
            return;
        }

        try {
            setLoading(true)
            const response = await axios.put(`${BASE_URL}/api/web/update/settle-emis`, {
                emis: selectedEmis?.map((emi) => ({ id: emi.id, penaltyStatus: emi.penaltyStatus })),
                description,
                type,
                loanId: details.id
                // numEmisToSettle,
            }, {
                headers: {
                    "Authorization": localStorage.getItem("token"),
                },
            });
            console.log(response)
            // refetch(); // Refetch or update data as necessary after successful settlement
            handleClose(); // Close the dialog after settlement
        } catch (error) {

            openSuccessSB("error", error.response.data.message)

            console.error("Failed to settle previous EMIs", error.response.data.message);
        } finally {
            setLoading(false)

        }
    };

    const formik = useFormik({
        initialValues: {
            emis: [{}]
        },
        enableReinitialize: true

    })

    useEffect(() => {
        if (!open) {
            // Reset state when modal is closed
            setData([]);
            changeTotal2(0);
            changePage(0);
            changePage2(1);
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
                        { field: 'id', headerName: 'Customer ID', flex: 1 },
                        { field: 'name', headerName: 'Name', flex: 1 },
                        { field: 'mobile', headerName: 'Mobile', flex: 1 },
                        { field: 'PAN', headerName: 'PAN', flex: 1 },
                        { field: 'Aadhaar', headerName: 'Aadhaar', flex: 1 },
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
                        { field: 'id', headerName: 'Officer ID', flex: 1 },
                        { field: 'name', headerName: 'Name', flex: 1 },
                        { field: 'mobile', headerName: 'Mobile', flex: 1 },
                        { field: 'assignedArea', headerName: 'Assigned Area', flex: 1 },
                    ]);
                    break;
                case 'EMI':
                    response = await axios.get(`${BASE_URL}/api/web/retrieve/emis`, {
                        params: { loanId: details.id, page, limit },
                        headers: {
                            "Authorization": localStorage.getItem("token")
                        }
                    });
                    console.log(response.data.data.data)
                    const emis = response.data.data.data.map((emi, index) => ({
                        ...emi,
                        sno: index + 1,
                        dueDate: moment(emi.dueDate).format("YYYY-MM-DD"),
                    }));
                    setData(emis);
                    setColumns([
                        // { field: 'id', headerName: 'id',  },
                        { field: 'sno', headerName: 'S.No', flex: 1 },
                        { field: 'amount', headerName: 'Amount', flex: 1 },
                        { field: 'penalty', headerName: 'Penalty', flex: 1 },
                        { field: 'dueDate', headerName: 'Due Date', flex: 1 },
                        {
                            field: 'status', headerName: 'Status', flex: 1, renderCell: (params) => (
                                <Chip label={params.value} color={params.value === "Paid" ? "success" : "primary"} />
                            ),
                        },
                        {
                            field: 'actions',
                            headerName: 'Actions',
                            renderCell: (params) => (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    onClick={() => handleViewPenalties(params.row.id)}
                                    sx={{ color: "white !important" }}
                                >
                                    View Penalties
                                </Button>
                            ),
                            flex: 1,
                        },
                    ]);

                    // Update the total count for pagination
                    changeTotal(response.data.data.count);
                    break;
                case 'Penalties':
                    try {
                        response = await axios.get(`${BASE_URL}/api/web/retrieve/penalties?loanId=${details.id}`, {
                            headers: {
                                "Authorization": localStorage.getItem("token")
                            }
                        });
                        const penalties = response.data.data?.map((item) => ({
                            ...item,
                            createdAt: moment(item.createdAt).utc().format("YYYY-MM-DD HH:mm:ss"),
                        }));
                        setData(penalties || []);
                        setColumns([
                            { field: "id", headerName: "Penalty ID", flex: 1 },
                            { field: "amount", headerName: "Amount", flex: 1 },
                            { field: "reason", headerName: "Reason", flex: 1 },
                            { field: "status", headerName: "Status", flex: 1 },
                            { field: "createdAt", headerName: "Created At", flex: 1 },
                        ]);
                    } catch (error) {
                        console.error("Failed to fetch penalties", error);
                    }
                    break;
                case 'Guarantor':
                    try {
                        response = await axios.get(`${BASE_URL}/api/web/retrieve/guarantor?guarantorId=${details.guarantorId}`, {
                            headers: {
                                "Authorization": localStorage.getItem("token")
                            }
                        });
                        console.log(response);
                        setData(response.data.data ? [response.data.data] : []);
                        setColumns([
                            { field: "name", headerName: "Name", flex: 1 },
                            { field: "mobile", headerName: "Mobile", flex: 1 },
                            { field: "PAN", headerName: "PAN", flex: 1 },
                            { field: "Aadhaar", headerName: "Aadhaar", flex: 1 },
                        ]);
                    } catch (error) {
                        console.error("Failed to fetch guarantor", error);
                    }
                    break;

                case 'Settle remaining Emis':
                    try {
                        if (page2 == 0) {
                            changePage2(1)
                            break;
                        }
                        setLoader(true)

                        response = await axios.get(`${BASE_URL}/api/web/retrieve/remaining-emis`, {
                            params: { loanId: details.id, page: page2 },
                            headers: {
                                "Authorization": localStorage.getItem("token"),
                            },
                        });
                        const remainingEmis = response.data.data.data?.map((emi) => ({
                            ...emi,
                            dueDate: moment(emi.dueDate).format("YYYY-MM-DD"),
                            penaltyStatus: "Waived"
                        }));
                        formik.setFieldValue("emis", remainingEmis.map((emi) => {
                            return { emiId: emi.id, status: "Waived" }
                        }))
                        setData(remainingEmis || []);

                        // setData(remainingEmis || []);
                        // setColumns([
                        //     { field: "id", headerName: "EMI ID", flex: 1 },
                        //     { field: "amount", headerName: "Amount", flex: 1 },
                        //     { field: "dueDate", headerName: "Due Date", flex: 1 },
                        //     { field: "status", headerName: "Status", flex: 1 },
                        // ]);
                        setData(remainingEmis ? remainingEmis?.map((emi) => ({
                            ...emi,
                            selected: false, // Add a selected property for checkboxes
                        })) : []);
                        changeTotal2(response.data.data.count);
                        setLoader(false)

                    } catch (error) {
                        console.error("Failed to fetch remaining EMIs", error);
                    }
                    break;
                case 'Settle previous Emis':
                    try {
                        if (page2 == 0) {
                            changePage2(1)
                            break;
                        }
                        setLoader(true)
                        response = await axios.get(`${BASE_URL}/api/web/retrieve/previous-emis`, {
                            params: { loanId: details.id, page: page2 },
                            headers: {
                                "Authorization": localStorage.getItem("token"),
                            },
                        });
                        const previousEmis = response.data.data.data?.map((emi) => ({
                            ...emi,
                            dueDate: moment(emi.dueDate).format("YYYY-MM-DD"),
                            penaltyStatus: "Waived"
                        }));
                        formik.setFieldValue("emis", previousEmis.map((emi) => {
                            return { emiId: emi.id, status: "Waived" }
                        }))
                        console.log(response.data.data)
                        setData(previousEmis || []);
                        // setColumns([
                        //     { field: "id", headerName: "EMI ID", flex: 1 },
                        //     { field: "amount", headerName: "Amount", flex: 1 },
                        //     { field: "dueDate", headerName: "Due Date", flex: 1 },
                        //     { field: "status", headerName: "Status", flex: 1 },
                        // ]);

                        // Add checkboxes to each row
                        setData(previousEmis ? previousEmis?.map((emi) => ({
                            ...emi,
                            selected: false,
                        })) : []);
                        console.log(response.data.data.count);
                        changeTotal2(response.data.data.count);
                        setLoader(false)

                    } catch (error) {
                        console.error("Failed to fetch previous EMIs", error);
                    }
                    break;
                case 'Statement':
                    try {
                        setLoader(true)
                        response = await axios.get(`${BASE_URL}/api/web/retrieve/statement`, {
                            params: { loanId: details.id },
                            headers: {
                                "Authorization": localStorage.getItem("token"),
                            },
                        });
                        const previousEmis = response.data.data.data?.map((emi) => ({
                            ...emi,
                            dueDate: moment(emi.dueDate).format("YYYY-MM-DD"),
                        }));
                        console.log(response.data.data)
                        setData(previousEmis || []);
                        setStats(response.data.data.stats);
                        console.log(stats)
                        setColumns([
                            { field: "id", headerName: "EMI ID", width: 100 },
                            { field: "amount", headerName: "Amount", width: 150 },
                            // { field: "dueDate", headerName: "Due Date", width: 120 },
                            { field: "status", headerName: "Status", width: 100 },
                            { field: "penalty", headerName: "Penalty", width: 120 },
                            { field: "totalPenaltyApplied", headerName: "Applied penalty", width: 150 },
                            { field: "paymentDate", headerName: "Payment Date", width: 180, valueFormatter: (params) => moment(params).format("YYYY MM DD HH:mm:ss") },

                        ]);

                        // Add checkboxes to each row
                        // setData(previousEmis ? previousEmis?.map((emi) => ({
                        //     ...emi,
                        //     selected: false, // Add a selected property for checkboxes
                        // })) : []);
                        console.log(data)

                    } catch (error) {
                        console.error("Failed to fetch previous EMIs", error);
                    } finally {
                        setLoading(false)
                    }

                    break;
                default:
                    break;
            }
        };

        fetchData();

    }, [details, type, refetch, page, limit, page2]); // Added page and limit to the dependency array
    const theme = createTheme({
        palette: {
            primary: { main: '#1976d2' },
            secondary: { main: '#d32f2f' },
            success: { main: '#2e7d32' },
        },
        typography: {
            fontFamily: "Roboto, Helvetica, Arial, sans-serif",
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

    const calculateHeight = (rowCount) => {
        const rowHeight = 52; // Default row height in DataGrid
        const headerHeight = 56; // Default header height in DataGrid
        return rowCount * rowHeight + headerHeight;
    };
    const contentRef = useRef();

    const handlePrint = () => {
        const printContent = contentRef.current;
        const WinPrint = window.open('', '', 'width=900,height=650');
        WinPrint.document.write(printContent.innerHTML);
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
    };


    return (
        <ThemeProvider theme={theme}>
            {["Settle previous Emis", "Settle remaining Emis"].includes(type) ? <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#1976d2' }}>
                    {type} Details
                </DialogTitle>
                <Box component="form" onSubmit={handleSettleEmis} sx={{ mb: 3 }}>
                    <DialogContent>
                        <Box sx={{ padding: 2 }}>
                            <Divider sx={{ mb: 2 }} />
                            {loader ? (
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <CircularProgress />
                                </Box>
                            ) : data?.length === 0 ? (
                                <Typography>No previous EMIs available</Typography>
                            ) : (
                                <Box>
                                    <FormControlLabel
                                        label="Select All"
                                        control={
                                            <Checkbox
                                                checked={selectAll}
                                                onChange={toggleSelectAll}
                                                sx={{
                                                    color: '#1976d2',
                                                }}
                                            />
                                        }
                                    />
                                    <Grid container spacing={2}>
                                        {paginatedData.map((emi, index) => {
                                            // console.log(emi)
                                            return (
                                                <Grid item xs={4} key={emi.id}>
                                                    <Card
                                                        sx={{
                                                            backgroundColor: '#f9f9f9',
                                                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                                            // padding: 2,
                                                            borderRadius: '8px',
                                                            borderLeft: `4px solid ${emi.status === 'Paid' ? '#4caf50' : '#ff5722'}`,
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={emi.selected}
                                                                        onChange={() => toggleEmiSelection(emi.id)}
                                                                        sx={{ color: emi.selected ? '#1976d2' : 'default' }}
                                                                    />
                                                                }
                                                                label={
                                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                                        EMI ID: <span style={{ color: '#1976d2' }}>{emi.id}</span>
                                                                    </Typography>
                                                                }
                                                            />
                                                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                                <strong>Amount:</strong> ₹{emi.amount}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                <strong>Due Date:</strong> {emi.dueDate}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                <strong>Status:</strong> {emi.status}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                <strong>Penalty:</strong> ₹{emi.penalty}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                <strong>Penalty Status:
                                                                    <Select
                                                                        labelId="demo-simple-select-label"
                                                                        id={`demo-simple-select` + emi.id}
                                                                        name={`emis.status`}
                                                                        value={emi.penaltyStatus || "Pending"}
                                                                        onChange={(e) => {
                                                                            console.log(data.filter((emi2) => {
                                                                                return emi2.id == emi.id
                                                                            }), e.target.value)
                                                                            setData(data.map((emi2) => {
                                                                                if (emi2.id == emi.id) {
                                                                                    return { ...emi2, penaltyStatus: e.target.value }
                                                                                } else {
                                                                                    return emi2
                                                                                }
                                                                            }))
                                                                        }}
                                                                        // InputProps={{
                                                                        //     padding:"0px !important",
                                                                        //     margin:"0px !important",
                                                                        // }}
                                                                        // // label="Penalty"
                                                                        // p={0}
                                                                     
                                                                        size={"small"}
                                                                    // onChange={handleChange}
                                                                    sx={{
                                                                        marginLeft:1,
                                                                        padding:0,
                                                                        "&>div":{
                                                                            padding:"3px",
                                                                        }
                                                                    }}
                                                                    >
                                                                        <MenuItem   p={0} value={"Applied"}>Applied</MenuItem>
                                                                        <MenuItem   p={0} value={"Waived"}>Waived</MenuItem>
                                                                        <MenuItem   p={0} value={"Pending"}>Pending</MenuItem>
                                                                    </Select></strong>
                                                            </Typography>

                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            )
                                        })}
                                    </Grid>
                                    {/* Pagination */}
                                    <Box display="flex" justifyContent="center" marginTop={2}>
                                        <Pagination
                                            count={Math.ceil(total2 / 10)}
                                            page={page2}
                                            onChange={handlePageChange}
                                            color="primary"
                                            sx={{
                                                '& .MuiPaginationItem-root': {
                                                    fontSize: '1rem',
                                                    fontWeight: 'bold',
                                                },
                                            }}
                                        />
                                    </Box>
                                    <TextField
                                        label="Description"
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                        multiline
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        sx={{ backgroundColor: '#f4f6f8', borderRadius: '8px' }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Grid container justifyContent="flex-end" gap={2}>
                            <Grid item xs={3}>
                                <Button type="submit" fullWidth variant="contained" disabled={loading} color="primary">
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Settle Selected EMIs"}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button onClick={handleClose} variant="contained" color="secondary">
                                    Close
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Box>
            </Dialog> : type == "Statement" ? <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>{type} Details</DialogTitle>
                <DialogContent >
                    <Box sx={{ padding: 2 }}>
                        <Divider sx={{ mb: 2 }} />
                        {data?.length === 0 ? (
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                {loading ? <CircularProgress /> : "No data found"}
                            </Box>
                        ) : (
                            <Box ref={contentRef} className={"print"}>
                                <Grid container className="print-only" justifyContent={"space-between"}>
                                    <Grid item>
                                        <img width={"100px"} src={"./logo.png"} alt="" />
                                    </Grid>
                                    <Grid item>
                                        <Box display={"inline-block"} sx={{ background: "", color: "black", fontSize: "5px !important" }}>
                                            <Typography variant="body1" className="statement-font"><strong>Name:</strong> {stats.loanDetails.customer.name}</Typography>
                                            <Typography variant="body1" className="statement-font"><strong>Mobile:</strong> {stats.loanDetails.customer.mobile}</Typography>
                                            <Typography variant="body1" className="statement-font"><strong>Address:</strong> {stats.loanDetails.customer.address}</Typography>
                                        </Box>
                                    </Grid>
                                    {/* <Typography variant="h6">Customer Information</Typography> */}
                                </Grid>

                                <DataGrid
                                    rows={data}
                                    columns={columns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { pageSize: limit, page },
                                        },
                                    }}

                                    paginationMode="server"
                                    page={page - 1}
                                    pageSize={limit}
                                    hideFooter={["Customer", "Guarantor", "FieldOfficer"].includes(type)}
                                    rowCount={total}
                                    onPaginationModelChange={(value) => {
                                        if (value.pageSize !== limit) {
                                            changeLimit(value.pageSize);
                                            return changePage(0);
                                        }
                                        changePage(value.page);
                                        changeLimit(value.pageSize);
                                    }}
                                    disableRowSelectionOnClick
                                    // className={"print-only"}
                                    classes={{
                                        footerContainer: "print-footer", // Apply your custom footer class here
                                    }}
                                />
                                <Divider sx={{ marginY: 2 }} />

                                <Box className="print-only" sx={{ padding: 2, maxWidth: 600 }} >
                                    <Divider sx={{ marginY: 2 }} />

                                    {/* Loan Details */}
                                    <Box>

                                        <Typography variant="h6">Loan Details</Typography>
                                        <Typography variant="body1" className="statement-font">Loan ID: {stats.loanDetails.id}</Typography>
                                        <Typography variant="body1" className="statement-font">Principle Amount: ₹{stats.loanDetails.amount.toLocaleString()}</Typography>
                                        <Typography variant="body1" className="statement-font">Interest Rate: {stats.loanDetails.interestRate}%</Typography>
                                        <Typography variant="body1" className="statement-font">Total Loan Amount: {stats.totalAmount}</Typography>
                                        <Typography variant="body1" className="statement-font">Remaining Balance: ₹{stats.totalRemainingBalance.toLocaleString()}</Typography>

                                        <Divider sx={{ marginY: 2 }} />

                                        <Typography variant="h6">Loan Timeline</Typography>
                                        <Typography variant="body1" className="statement-font">Emi Start Date: {moment(stats.timelineData[0].minDate).utc().format('MMMM Do YYYY, h:mm:ss a')}</Typography>
                                        <Typography variant="body1" className="statement-font">Emi End Date: {moment(stats.timelineData[0].maxDate).utc().format('MMMM Do YYYY, h:mm:ss a')}</Typography>

                                        <Divider sx={{ marginY: 2 }} />
                                    </Box>
                                </Box>
                            </Box>
                        )}

                    </Box>
                </DialogContent>
                <DialogActions>
                    <ReactToPrint
                        trigger={() => <Button>Print</Button>}
                        content={() => contentRef.current}
                    />
                    <Button onClick={handleClose} variant="contained" color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog> : <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>{type} Details</DialogTitle>
                <DialogContent>
                    <Box sx={{ padding: 2 }}>
                        <Divider sx={{ mb: 2 }} />
                        {data?.length === 0 ? (
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <div style={{ height: type == "EMI" ? 400 : "auto", width: '100%' }}>
                                <DataGrid
                                    rows={data}
                                    columns={columns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { pageSize: limit, page },
                                        },
                                    }}
                                    paginationMode="server"
                                    page={page - 1}
                                    pageSize={limit}
                                    hideFooter={["Customer", "Guarantor", "FieldOfficer"].includes(type)}
                                    rowCount={total}
                                    onPaginationModelChange={(value) => {
                                        if (value.pageSize !== limit) {
                                            changeLimit(value.pageSize);
                                            return changePage(0);
                                        }
                                        changePage(value.page);
                                        changeLimit(value.pageSize);
                                    }}
                                    disableRowSelectionOnClick
                                />
                            </div>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            }


            {/* Penalties Modal */}
            <Dialog open={openPenaltiesModal} onClose={handleClosePenaltiesModal} fullWidth maxWidth="md">
                <DialogTitle>Penalties Details</DialogTitle>
                <DialogContent>
                    <Box sx={{ padding: 2 }}>
                        <Divider sx={{ mb: 2 }} />
                        {penaltiesData?.length === 0 ? (
                            <Typography>No penalties available</Typography>
                        ) : (
                            <div style={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    rows={penaltiesData}
                                    columns={penaltiesColumns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { pageSize: limit, page },
                                        },
                                    }}
                                    paginationMode="server"
                                    page={page - 1}
                                    pageSize={limit}
                                    rowCount={total}
                                    onPaginationModelChange={(value) => {
                                        if (value.pageSize !== limit) {
                                            changeLimit(value.pageSize);
                                            return changePage(0);
                                        }
                                        changePage(value.page);
                                        changeLimit(value.pageSize);
                                    }}
                                    disableRowSelectionOnClick
                                />
                                {/* <DataGrid
                                    rows={penaltiesData}
                                    columns={penaltiesColumns}
                                    hideFooter
                                    disableRowSelectionOnClick
                                /> */}
                            </div>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePenaltiesModal} variant="contained" color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider >
    );
};

export default DetailDialog;
