import React, { useMemo, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  isToday,
} from "date-fns";
import styles from "../../styles/components/calendar/calendar.module.scss";
import Modal from "../modals/Modal";
import Row from "../accounts/TransactionRow";
import TransactionInfo from "../transactions/TransactionInfo";
import ChevronLeft from "../icons/chevrons/DoubleChevronLeft.jsx";
import ChevronRight from "../icons/chevrons/DoubleChevronRight.jsx";
import { onEnterOrSpace } from "../../utils/accessibility";
import i18n from "../../configuration/i18n";

const isIncome = (t) => t.type === "incomse";
const isExpense = (t) => t.type === "expense";
const isTransfer = (t) => t.type === "in-transfer" || t.type === "out-transfer";

const CalendarComponent = ({ transactions = [], accounts = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // بنجمّع المعاملات حسب اليوم (yyyy-MM-dd) مرة وحدة، بدل ما نفلترها من جديد
  // لكل خانة يوم بالتقويم.
  const transactionsByDay = useMemo(() => {
    const map = new Map();
    transactions.forEach((t) => {
      if(!t || !t.createdAt) {
        console.warn("Transaction missing createdAt:", t);
        return; // Skip this transaction if createdAt is missing
      }
      if (t.createdAt === undefined || t.createdAt === null) {
        t.createdAt = new Date().toISOString(); // Assign current date if createdAt is missing
      }
      const key = format(new Date(t.createdAt), "yyyy-MM-dd");
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    });
    return map;
  }, [transactions]);

  // الأسبوع بيبلش الاثنين (متعارف عليه بالسويد/أوروبا) بدل الأحد.
  const daysGrid = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const weekDayLabels = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return format(d, "EEEEEE");
    });
  }, []);

  const selectedDayTransactions = selectedDay
    ? transactionsByDay.get(format(selectedDay, "yyyy-MM-dd")) || []
    : [];

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.monthHeader}>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => setCurrentMonth((d) => subMonths(d, 1))}
          aria-label={i18n.t("calendar.previousMonth")}
        >
          <ChevronLeft />
        </button>
        <h2>{format(currentMonth, "MMMM yyyy")}</h2>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => setCurrentMonth((d) => addMonths(d, 1))}
          aria-label={i18n.t("calendar.nextMonth")}
        >
          <ChevronRight />
        </button>
      </div>

      <div className={styles.weekDaysRow}>
        {weekDayLabels.map((label, i) => (
          <div key={i} className={styles.weekDayLabel}>{label}</div>
        ))}
      </div>

      <div className={styles.daysGrid}>
        {daysGrid.map((day) => {
          const dayTransactions = transactionsByDay.get(format(day, "yyyy-MM-dd")) || [];
          const income = dayTransactions.filter(isIncome).reduce((sum, t) => sum + Number(t.amount), 0);
          const expense = dayTransactions.filter(isExpense).reduce((sum, t) => sum + Number(t.amount), 0);
          const transferCount = dayTransactions.filter(isTransfer).length;
          const hasData = dayTransactions.length > 0;
          const inCurrentMonth = isSameMonth(day, currentMonth);

          const handleOpenDay = () => {
            if (hasData) setSelectedDay(day);
          };

          return (
            <div
              key={day.toISOString()}
              className={`${styles.dayCell} ${!inCurrentMonth ? styles.outsideMonth : ""} ${isToday(day) ? styles.today : ""}`}
              onClick={hasData ? handleOpenDay : undefined}
              role={hasData ? "button" : undefined}
              tabIndex={hasData ? 0 : undefined}
              onKeyDown={hasData ? onEnterOrSpace(handleOpenDay) : undefined}
            >
              <span className={styles.dayNumber}>{format(day, "d")}</span>
              {hasData && (
                <div className={styles.dayTotals}>
                  {income > 0 && <span className={styles.income}>+{income}</span>}
                  {expense > 0 && <span className={styles.expense}>-{expense}</span>}
                  {transferCount > 0 && <span className={styles.transferDot} title={i18n.t("calendar.transfers")} />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* نافذة معاملات اليوم المحدد */}
      <Modal
        isOpen={!!selectedDay}
        onClose={() => setSelectedDay(null)}
        className={styles.dayModal}
      >
        <h3 className={styles.dayModalTitle}>
          {selectedDay && format(selectedDay, "MMMM d, yyyy")}
        </h3>
        <div className={styles.dayModalList}>
          {selectedDayTransactions.length > 0 ? (
            selectedDayTransactions.map((t) => (
              <Row
                key={t.id}
                transaction={t}
                onClick={() => setSelectedTransaction(t)}
              />
            ))
          ) : (
            <p>{i18n.t("calendar.noTransactions")}</p>
          )}
        </div>
      </Modal>

      {/* تفاصيل معاملة واحدة (فوق نافذة اليوم) */}
      {selectedTransaction && (
        <TransactionInfo
          isOpen={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          transaction={selectedTransaction}
          accounts={accounts}
          transactions={transactions}
        />
      )}
    </div>
  );
};

export default CalendarComponent;
