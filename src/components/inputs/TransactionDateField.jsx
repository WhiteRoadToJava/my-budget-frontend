import Datepicker from './Datepicker.jsx'
import {todayString} from '../../utils/transactions/transactionDate.js'
import i18n from "../../configuration/i18n.js";



const TransactionDateField = ({
    value,
    onchange,
    className,
    labelClassName,
}) => {
    <div className={className}>
        <label className={labelClassName}>{i18n.t("transactionDate.label")}</label>
        <Datepicker value={value} onchange={onchange} max={todayString} />
    </div>
};


export default TransactionDateField; 