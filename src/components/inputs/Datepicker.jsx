"use client";
import { useState, useRef, useEffect } from "react";
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  subMonths,
} from "date-fns";
import styles from "../../styles/inputs/datepicker.module.scss";
import Calendar from "../icons/calendar/Calendar";

export default function Datepicker({ onChange, value }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
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

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  return (
    <div className={styles.datePicker}>
      <div
        className={styles.inputWrapper}
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <input
          type="text"
          value={value ? format(new Date(value), "MMM dd, yyyy") : ""}
          placeholder="Choose date..."
          readOnly
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
            >
              ←
            </button>

            <span>{format(currentMonth, "MMMM yyyy")}</span>

            <button
              type="button"
              onClick={() => setCurrentMonth((date) => addMonths(date, 1))}
            >
              →
            </button>
          </div>

          <div className={styles.calendar}>
            {getDaysInMonth().map((day) => (
              <div
                key={day.toString()}
                className={styles.day}
                onClick={() => handleDateClick(day)}
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
