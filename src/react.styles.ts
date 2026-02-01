import type { CSSProperties } from "react";

interface Styles {
  container: CSSProperties;
  header: CSSProperties;
  timeDisplay: {
    current: {
      container: CSSProperties;
      value: CSSProperties;
    };
    real: {
      container: CSSProperties;
      value: CSSProperties;
    };
    label: CSSProperties;
  };
  offset: {
    container: CSSProperties;
    label: CSSProperties;
    value: CSSProperties;
  };
  form: {
    fieldGroup: CSSProperties;
    field: CSSProperties;
    label: CSSProperties;
    input: CSSProperties;
  };
  buttons: {
    group: CSSProperties;
    apply: CSSProperties;
    clear: CSSProperties;
  };
}

const timeDisplayContainer: CSSProperties = {
  marginBottom: "16px",
  padding: "12px",
  borderRadius: "4px",
  border: "1px solid #e0e0e0",
};

const timeDisplayValue: CSSProperties = {
  fontSize: "20px",
  fontFamily: "monospace",
};

const buttonBase: CSSProperties = {
  flex: 1,
  padding: "10px 16px",
  border: "none",
  borderRadius: "4px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
};

export const styles: Styles = {
  container: {
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontSize: "14px",
    padding: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    maxWidth: "400px",
  },

  header: {
    fontFamily: "system-ui, -apple-system, sans-serif",
    margin: "0 0 12px 0",
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
  },

  timeDisplay: {
    current: {
      container: { ...timeDisplayContainer, backgroundColor: "#fff" },
      value: { ...timeDisplayValue, color: "#333" },
    },
    real: {
      container: { ...timeDisplayContainer, backgroundColor: "#f5f5f5" },
      value: { ...timeDisplayValue, color: "#666" },
    },
    label: {
      fontSize: "12px",
      color: "#666",
      marginBottom: "4px",
    },
  },

  offset: {
    container: {
      marginBottom: "16px",
      padding: "8px 12px",
      backgroundColor: "#e8f4fd",
      borderRadius: "4px",
      fontSize: "13px",
    },
    label: {
      fontWeight: "600",
      color: "#555",
    },
    value: {
      marginLeft: "8px",
      color: "#1a73e8",
    },
  },

  form: {
    fieldGroup: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "12px",
      marginBottom: "16px",
    },
    field: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      fontSize: "12px",
      color: "#666",
      marginBottom: "4px",
    },
    input: {
      padding: "8px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "14px",
      width: "100%",
      boxSizing: "border-box",
    },
  },

  buttons: {
    group: {
      display: "flex",
      gap: "8px",
    },
    apply: { ...buttonBase, backgroundColor: "#1a73e8", color: "#fff" },
    clear: { ...buttonBase, backgroundColor: "#f1f3f4", color: "#333" },
  },
};
