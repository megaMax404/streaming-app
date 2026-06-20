function AdminTabs({
  adminTab,
  setAdminTab,
}) {
  const tabs = [
    {
      key: "movie",
      label: "🎬 จัดการหนัง",
    },
    {
      key: "banner",
      label: "🖼 แบนเนอร์",
    },
    {
      key: "check",
      label: "🖼 ตรวจสอบหนัง",
    },
    {
      key: "setting",
      label: "⚙ ตั้งค่าเว็บ",
    },
  ];

  return (
    <div className="admin-tabs-vertical">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`admin-tab-btn ${
            adminTab === tab.key
              ? "active"
              : ""
          }`}
          onClick={() =>
            setAdminTab(tab.key)
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default AdminTabs;