import { type JSX, useEffect, useState } from "react";
import { clearOffset, setOffset } from "./browser";
import { parseOffsetFromCookie } from "./cookie";
import { OriginalDate, type TimeOffset } from "./core";
import { styles } from "./react.styles";

type OffsetField =
  | "years"
  | "months"
  | "days"
  | "hours"
  | "minutes"
  | "seconds";

const FIELDS: OffsetField[] = [
  "years",
  "months",
  "days",
  "hours",
  "minutes",
  "seconds",
];

const FIELD_LABELS: Record<OffsetField, string> = {
  years: "Years",
  months: "Months",
  days: "Days",
  hours: "Hours",
  minutes: "Minutes",
  seconds: "Seconds",
};

function getCurrentOffset(): TimeOffset | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }
  return parseOffsetFromCookie(document.cookie);
}

function formatCurrentOffset(offset: TimeOffset | undefined): string {
  if (!offset) {
    return "None";
  }

  const parts: string[] = [];

  for (const field of FIELDS) {
    const value = offset[field];
    if (value !== undefined && value !== 0) {
      const sign = value > 0 ? "+" : "";
      parts.push(`${sign}${value} ${field}`);
    }
  }

  return parts.length > 0 ? parts.join(", ") : "None";
}

export function FakeTimeController(): JSX.Element {
  const [values, setValues] = useState<Record<OffsetField, string>>({
    years: "",
    months: "",
    days: "",
    hours: "",
    minutes: "",
    seconds: "",
  });
  const [timeState, setTimeState] = useState<{
    currentTime: Date | null;
    realTime: Date | null;
    currentOffset: TimeOffset | undefined;
  }>({ currentTime: null, realTime: null, currentOffset: undefined });

  useEffect(() => {
    const update = () =>
      setTimeState({
        currentTime: new Date(),
        realTime: new OriginalDate(),
        currentOffset: getCurrentOffset(),
      });

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const offset: TimeOffset = {};

    for (const field of FIELDS) {
      const value = values[field];
      if (value !== "") {
        const num = Number.parseInt(value, 10);
        if (!Number.isNaN(num) && num !== 0) {
          offset[field] = num;
        }
      }
    }

    if (Object.keys(offset).length > 0) {
      setOffset(offset);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Fake Time Controller</h3>

      <TimeDisplay
        label="Current Time (with offset applied)"
        time={timeState.currentTime}
        variant="current"
      />
      <TimeDisplay
        label="Real Time (original)"
        time={timeState.realTime}
        variant="real"
      />

      <div style={styles.offset.container}>
        <span style={styles.offset.label}>Current offset:</span>
        <span style={styles.offset.value}>
          {formatCurrentOffset(timeState.currentOffset)}
        </span>
      </div>

      <form onSubmit={handleApply}>
        <div style={styles.form.fieldGroup}>
          {FIELDS.map((field) => (
            <label key={field} style={styles.form.field}>
              <span style={styles.form.label}>{FIELD_LABELS[field]}</span>
              <input
                type="number"
                step="1"
                name={field}
                value={values[field]}
                onChange={handleFieldChange}
                placeholder="0"
                style={styles.form.input}
              />
            </label>
          ))}
        </div>

        <div style={styles.buttons.group}>
          <button type="submit" style={styles.buttons.apply}>
            Apply
          </button>
          <button
            type="button"
            onClick={clearOffset}
            style={styles.buttons.clear}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

interface TimeDisplayProps {
  label: string;
  time: Date | null;
  variant: "current" | "real";
}

function TimeDisplay({ label, time, variant }: TimeDisplayProps): JSX.Element {
  const variantStyles = styles.timeDisplay[variant];

  return (
    <div style={variantStyles.container}>
      <div style={styles.timeDisplay.label}>{label}</div>
      <div style={variantStyles.value}>{time?.toLocaleString() ?? "-"}</div>
    </div>
  );
}
