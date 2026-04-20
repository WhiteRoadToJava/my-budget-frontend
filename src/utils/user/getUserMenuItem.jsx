import Calendar from "../../components/icons/calendar/Calendar.jsx";
import Home from "../../components/icons/interface/Home";
import FileCode from "../../components/icons/file_code/FolderCode";
import SettingsIcon from "../../components/sidebar/icons/SettingsIcon";

export const getUserMenuItems = [
  { label: "Overview", icon: <Home />, link: "/user/" },
  { label: "Accounts", icon: <FileCode />, link: "/user/accounts" },
  { label: "Expenses", icon: <FileCode />, link: "/user/expenses" },
  { label: "Incomes", icon: <FileCode />, link: "/user/incomses" },
  { label: "Transactions", icon: <FileCode />, link: "/user/transactions" },
  { label: "Calendar", icon: <Calendar />, link: "/user/calendar" },
  { label: "Settings", icon: <SettingsIcon />, link: "/user/settings" },
];
