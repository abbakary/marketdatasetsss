export default function Footer() {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "10px 8px",
        background: "#F6F8FC",
        borderTop: "1px solid rgba(15,23,42,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            color: "#04121D",
            fontSize: "0.8rem",
          }}
        >
          © {new Date().getFullYear()}{" "}
          <span
            style={{
              color: "#0492C2",
              fontWeight: 600,
            }}
          >
            RADA AGRICULTURE Version 3.0
          </span>
        </span>
      </div>
    </footer>
  );
}
