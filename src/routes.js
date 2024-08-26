import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import Icon from "@mui/material/Icon";
import Customers from "layouts/customer/Customers";
import FieldOfficer from "layouts/fieldOfficer/FieldOfficer";
import LoanManagementPage from "layouts/loans/LoanManagementPage";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  // {
  //   type: "collapse",
  //   name: "Tables",
  //   key: "tables",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/tables",
  //   component: <Tables />,
  // },
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  {
    type: "collapse",
    name: "Loans",
    key: "loans",
    icon: <Icon fontSize="small">attach_money</Icon>,  // Updated icon here
    route: "/loans",
    component: <LoanManagementPage />,
  },
  {
    type: "collapse",
    name: "Field Officers",
    key: "fieldOfficer",
    icon: <Icon fontSize="small">badge</Icon>,
    route: "/fieldOfficers",
    component: <FieldOfficer />,
  },
  {
    type: "collapse",
    name: "Customers",
    key: "customer",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/customer",
    component: <Customers />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
];

export default routes;
