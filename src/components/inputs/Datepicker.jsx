import { useState, useRef, useEffect } from "react";
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  subMonths,
  isSameDay,
  getDay,
  startOfWeek,
  addDays,
} from "date-fns";
import styles from "../../styles/inputs/datepicker.module.scss";
import Calendar from "../icons/calendar/Calendar";
import { onEnterOrSpace } from "../../utils/accessibility";
import { dateFnsLocale, toCalendarDay } from "../../utils/dates";
import i18n from "../../configuration/i18n";

// value and onChange use "yyyy-MM-dd"; values with a time part are accepted too
export default function Datepicker({ onChange, value }) {
  const selected = toCalendarDay(value);
  const locale = dateFnsLocale(i18n.language);
  const weekStartsOn = locale.options?.weekStartsOn ?? 1;

  const [showCalendar, setShowCalendar] = useState(false);
  // open on the month of the chosen date, not always on this month
  const [currentMonth, setCurrentMonth] = useState(() => selected ?? new Date());
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleDateClick = (date) => {
    onChange(format(date, "yyyy-MM-dd"));
    setShowCalendar(false);
  };

  const monthStart = startOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: endOfMonth(currentMonth) });
  // empty cells so the 1st falls under the right weekday
  const leadingBlanks = (getDay(monthStart) - weekStartsOn + 7) % 7;
  const firstWeekDay = startOfWeek(monthStart, { weekStartsOn });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(firstWeekDay, i));
  const today = new Date();

  return (
    <div className={styles.datePicker}>
      <div
        className={styles.inputWrapper}
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <input
          type="text"
          value={selected ? format(selected, "d MMM yyyy", { locale }) : ""}
          placeholder={i18n.t("placeholder.date")}
          readOnly
          onKeyDown={onEnterOrSpace(() => setShowCalendar((prev) => !prev))}
        />
        <span className={styles.calendarIcon}>
          <Calendar color="#E7E7E7" />
        </span>
      </div>

      {showCalendar && (
        <div className={styles.calendarContainer} ref={calendarRef}>
          <div className={styles.monthSelector}>
            <button
              type="button"
              onClick={() => setCurrentMonth((date) => subMonths(date, 1))}
              aria-label="previous month"
            >
              ←
            </button>

            <span>{format(currentMonth, "MMMM yyyy", { locale })}</span>

            <button
              type="button"
              onClick={() => setCurrentMonth((date) => addMonths(date, 1))}
              aria-label="next month"
            >
              →
            </button>
          </div>

          <div className={styles.calendar}>
            {weekDays.map((d) => (
              <div key={`w-${d.toString()}`} className={styles.weekDay} aria-hidden="true">
                {format(d, "EEEEEE", { locale })}
              </div>
            ))}
            {Array.from({ length: leadingBlanks }, (_, i) => (
              <div key={`b-${i}`} aria-hidden="true" />
            ))}
            {days.map((day) => (
              <div
                key={day.toString()}
                className={styles.day}
                data-selected={selected ? isSameDay(day, selected) : false}
                data-today={isSameDay(day, today)}
                onClick={() => handleDateClick(day)}
                role="button"
                tabIndex={0}
                aria-label={format(day, "PPP", { locale })}
                onKeyDown={onEnterOrSpace(() => handleDateClick(day))}
              >
                {format(day, "d")}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
