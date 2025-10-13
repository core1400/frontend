import { useMemo, useState } from "react";
import styles from "./calendar.module.css";
import { EventModal } from "./components/EventModal";
import type { EventFormValues } from "./components/EventModal";

/** User roles for permissions */
export type UserRole = "חניך" | "מפקד" | 'ממ"ק';

/** A single calendar event */
type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color: string;
};

/* -------------------- date/time helpers -------------------- */

const zeroPad2 = (n: number) => String(n).padStart(2, "0");

const formatYmd = (d: Date) =>
  `${d.getFullYear()}-${zeroPad2(d.getMonth() + 1)}-${zeroPad2(d.getDate())}`;

/** Week starts on Sunday (0) in JS—this returns the Sunday of the given day */
const getWeekStartSunday = (d: Date) => {
  const copy = new Date(d);
  const day = copy.getDay(); // 0..6 (0=Sunday)
  copy.setDate(copy.getDate() - day);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const addDaysSafe = (d: Date, days: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
};

const HEBREW_DAY_NAMES = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

const formatHourRange = (start: Date, end: Date) => {
  const fmt = (t: Date) => `${zeroPad2(t.getHours())}:${zeroPad2(t.getMinutes())}`;
  return `${fmt(start)} - ${fmt(end)}`;
};

/* -------------------- component -------------------- */

/**
 * Ready for Redux: pass role via prop when available.
 * If not provided, a safe dummy role is used.
 */
export default function CalendarPage({ role: roleProp }: { role?: UserRole }) {
  const role: UserRole = roleProp ?? DEFAULT_USER_ROLE;
  const canEdit = role !== "חניך";

  // selected day (default: today at 00:00)
  const [selectedDay, setSelectedDay] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  /** events grouped by day key "YYYY-MM-DD" */
  const [eventsByDateMap, setEventsByDateMap] = useState<
    Record<string, CalendarEvent[]>
  >({});

  const weekStart = useMemo(() => getWeekStartSunday(selectedDay), [selectedDay]);

  const daysOfCurrentWeek = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDaysSafe(weekStart, i)),
    [weekStart]
  );

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  /* -------------------- handlers -------------------- */

  const handleOpenCreateForDay = (day: Date) => {
    if (!canEdit) return;
    setEditingEvent(null);
    setModalDate(day);
    setIsModalOpen(true);
  };

  const handleCreateEvent = (form: EventFormValues) => {
    if (!modalDate) return;

    const [sh, sm] = form.startTime.split(":").map(Number);
    const [eh, em] = form.endTime.split(":").map(Number);

    const start = new Date(modalDate);
    start.setHours(sh, sm, 0, 0);
    const end = new Date(modalDate);
    end.setHours(eh, em, 0, 0);

    const newEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      description: form.description?.trim(),
      start,
      end,
      color: form.color,
    };

    const key = formatYmd(modalDate);
    setEventsByDateMap((prev) => ({
      ...prev,
      [key]: [...(prev[key] ?? []), newEvent].sort(
        (a, b) => a.start.getTime() - b.start.getTime()
      ),
    }));

    setIsModalOpen(false);
    setModalDate(null);
  };

  const handleUpdateEvent = (form: EventFormValues) => {
    if (!modalDate || !editingEvent) return;

    const [sh, sm] = form.startTime.split(":").map(Number);
    const [eh, em] = form.endTime.split(":").map(Number);

    const start = new Date(modalDate);
    start.setHours(sh, sm, 0, 0);
    const end = new Date(modalDate);
    end.setHours(eh, em, 0, 0);

    const key = formatYmd(modalDate);

    setEventsByDateMap((prev) => {
      const updated = (prev[key] ?? []).map((ev) =>
        ev.id === editingEvent.id
          ? { ...ev, title: form.title, description: form.description, color: form.color, start, end }
          : ev
      );
      return { ...prev, [key]: updated.sort((a, b) => a.start.getTime() - b.start.getTime()) };
    });

    setIsModalOpen(false);
    setModalDate(null);
    setEditingEvent(null);
  };

  const handleDeleteEvent = () => {
    if (!modalDate || !editingEvent) return;

    const key = formatYmd(modalDate);
    setEventsByDateMap((prev) => ({
      ...prev,
      [key]: (prev[key] ?? []).filter((ev) => ev.id !== editingEvent.id),
    }));

    setIsModalOpen(false);
    setModalDate(null);
    setEditingEvent(null);
  };

  const handlePrevWeek = () => setSelectedDay(addDaysSafe(weekStart, -7));
  const handleNextWeek = () => setSelectedDay(addDaysSafe(weekStart, +7));

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value; // yyyy-mm-dd
    if (!v) return;
    const [y, m, d] = v.split("-").map(Number);
    setSelectedDay(new Date(y, m - 1, d));
  };

  /* -------------------- render -------------------- */

  return (
    <div className={styles.calendarPage} dir="rtl">
      <header className={styles.calendarHeader}>
        <h1 className={styles.title}>
          לו"ז <span className={styles.accent}> שבועי</span>
        </h1>

        <div className={styles.calendarControls}>
          <div className={styles.arrowsGroup}>
            <button className={styles.navBtn} onClick={handlePrevWeek} aria-label="שבוע קודם">‹</button>
            <button className={styles.navBtn} onClick={handleNextWeek} aria-label="שבוע הבא">›</button>
          </div>

          <div className={styles.datePicker}>
            <label htmlFor="weekDate" className={styles.srOnly}>תאריך</label>
            <input id="weekDate" type="date" value={formatYmd(selectedDay)} onChange={handleDateChange} />
          </div>
        </div>
      </header>

      {/* single horizontal scroll for narrow screens */}
      <section className={styles.calendarScroller}>
        <div className={styles.calendarTable}>
          {/* Head row */}
          <div className={`${styles.calendarHeadRow} ${styles.stickyHead}`}>
            {daysOfCurrentWeek.map((day, idx) => (
              <button
                key={idx}
                className={styles.dayHead}
                onClick={() => handleOpenCreateForDay(day)}
                title={canEdit ? "הוסף אירוע ליום זה" : ""}
                disabled={!canEdit}
              >
                <div className={styles.dayName}>{HEBREW_DAY_NAMES[idx]}</div>
                <div className={styles.dayDate}>{day.getDate()}.{day.getMonth() + 1}</div>
              </button>
            ))}
          </div>

          {/* Columns */}
          <div className={styles.calendarColumns}>
            {daysOfCurrentWeek.map((day, idx) => {
              const dayKey = formatYmd(day);
              const eventsForDay = eventsByDateMap[dayKey] ?? [];

              return (
                <div key={idx} className={styles.dayCol}>
                  {eventsForDay.map((event) => {
                    const card = (
                      <div
                        className={styles.eventCard}
                        style={{ backgroundColor: event.color }}
                        title={event.description || event.title}
                      >
                        <div className={styles.eventTitle}>{event.title}</div>

                        {/* per your spec earlier, cadets see the description */}
                        {role === "חניך" && event.description && (
                          <div className={styles.eventDescr}>{event.description}</div>
                        )}

                        <div className={styles.eventTime}>
                          {formatHourRange(event.start, event.end)}
                        </div>
                      </div>
                    );

                    return canEdit ? (
                      <button
                        key={event.id}
                        className={styles.eventBtnWrap}
                        onClick={() => {
                          setEditingEvent(event);
                          setModalDate(day);
                          setIsModalOpen(true);
                        }}
                      >
                        {card}
                      </button>
                    ) : (
                      <div key={event.id}>{card}</div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {isModalOpen && modalDate && (
        <EventModal
          mode={editingEvent ? "edit" : "create"}
          readOnly={!canEdit}
          dateForEvent={modalDate}
          initialValues={
            editingEvent
              ? {
                  title: editingEvent.title,
                  description: editingEvent.description ?? "",
                  startTime: `${zeroPad2(editingEvent.start.getHours())}:${zeroPad2(editingEvent.start.getMinutes())}`,
                  endTime: `${zeroPad2(editingEvent.end.getHours())}:${zeroPad2(editingEvent.end.getMinutes())}`,
                  color: editingEvent.color,
                }
              : undefined
          }
          onClose={() => {
            setIsModalOpen(false);
            setModalDate(null);
            setEditingEvent(null);
          }}
          onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
          onDelete={editingEvent ? handleDeleteEvent : undefined}
        />
      )}
    </div>
  );
}

/** Fallback role until Redux is wired in */
const DEFAULT_USER_ROLE: UserRole = "מפקד";
/* When Redux is ready:
   <CalendarPage role={useSelector((s: RootState) => s.auth.role)} />
*/
