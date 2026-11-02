import rent from "./icons/rent.svg"
import car from "./icons/car.svg"
import food from "./icons/food.svg"
import salary from "./icons/salary.svg"
import childAllowance from "./icons/allowance.svg"
import housingAllowance from "./icons/allowance.svg"
import bus_transport from "./icons/bus-transport.svg"
import check from "./icons/check.svg"
import currency from "./icons/currency.svg"
import delivery from "./icons/delivery.svg"
import home from "./icons/home.svg"
import wallet from "./icons/wallet.svg"
import shopping from "./icons/shopping.svg"
import bank from "./icons/bank.svg"
import gift from "./icons/gift.svg"
import bills from "./icons/bills.svg"
import investment from "./icons/investment.svg"
import debt from "./icons/debt.svg"



export const expenseCategoryList = [
    {
        id: 1,
        name:"Rent",
        icon: rent
    },
    {
        id: 2,
        name:"Food",
        icon: food
    },
    {
        id: 3,
        name:"Groceries",
        icon: shopping
    },
    {
        id: 4,
        name:"Car",
        icon: car
    },
    {
        id: 5,
        name:"Bus transport",
        icon: bus_transport
    },
    {
        id: 6,
        name:"Check",
        icon: check
    },
    {
        id: 7,
        name:"Currency",
        icon: currency
    },
    {
        id: 8,
        name:"Delivery",
        icon: delivery
    },
    {
        id: 9,
        name:"Home",
        icon: home
    },
    {id: 10,
        name:"Gift",
        icon: gift
    },
    {
        id: 11,
        name: "bills",
        icon: bills
    }

]

export const incomseCategoryList = [   
    {
        id: 1,
        name:"Salary",
        icon: salary  
    },
    {
        id: 2,
        name:"Child allowance",
        icon: childAllowance   
    },
    {
        id: 3,
        name:"Housing allowance",
        icon: housingAllowance   
    },
    {
        id: 4,
        name:"Gift",
        icon: gift   
    },
    {
        id: 5,
        name:"Wallet",
        icon: wallet   
    },
    {
        id: 6,
        name:"Bank",
        icon: bank   
    },
 
    {
        id: 7,
        name:"Investment",
        icon: investment  
    },
]

// Records created by a debt movement (and debt payment schedules) are stored by the
// backend with the category "Debt" instead of a numeric id from the lists above.
// It is not in the lists on purpose: users should not pick it in income/expense forms.
export const DEBT_CATEGORY = "Debt";

export const debtCategory = {
    id: DEBT_CATEGORY,
    name: "Debt",
    icon: debt
};

// Finds the category of a transaction, including "Debt" and debt-in / debt-out rows.
export const findCategory = (category, type) => {
    if (category === DEBT_CATEGORY || type === "debt-in" || type === "debt-out") {
        return debtCategory;
    }
    const list = type === "incomse" ? incomseCategoryList : expenseCategoryList;
    return list.find((item) => item.id === Number(category));
};
