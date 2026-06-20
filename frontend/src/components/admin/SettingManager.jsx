import { API_URL } from "../../config";
import { useEffect, useState } from "react";
import axios from "axios";

function SettingManager({
  adminTab,
  setAdminTab
}) {

  const [movieCount, setMovieCount] =
    useState(0);

  const [bannerCount, setBannerCount] =
    useState(0);

  const [totalVisitors, setTotalVisitors] =
    useState(0);

  const [todayVisitors, setTodayVisitors] =
    useState(0);

  const [lastBackup, setLastBackup] =
    useState(
      localStorage.getItem(
        "lastBackup"
      ) || "-"
    );

  const [siteName, setSiteName] =
    useState("Movie Streaming");

  const [backupFiles, setBackupFiles] = useState([]);
  const [backupPage, setBackupPage] = useState(1);
  const BACKUPS_PER_PAGE = 5;

  useEffect(() => {
    fetchBackups();

    fetch(
      `${API_URL}/api/movies`
    )
      .then((res) => res.json())
      .then((data) =>
        setMovieCount(
          data.length
        )
      );

    fetch(
      `${API_URL}/api/banners`
    )
      .then((res) => res.json())
      .then((data) =>
        setBannerCount(
          data.length
        )
      );

    fetch(
      `${API_URL}/api/stats`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("adminToken")}`
        }
      }
    )
      .then((res) => res.json())
      .then((data) => {

        setTotalVisitors(data.visits || 0);

        setTodayVisitors(data.todayVisitors || 0);

      });
  }, []);

  const exportMovies =
    async () => {
      try {

        const res =
          await fetch(
            `${API_URL}/api/movies`
          );

        const movies =
          await res.json();

        const dataStr =
          JSON.stringify(
            movies,
            null,
            2
          );

        const blob =
          new Blob(
            [dataStr],
            {
              type:
                "application/json",
            }
          );

        const url =
          URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download =
          `movies-backup-${new Date()
            .toISOString()
            .split("T")[0]
          }.json`;

        const backupDate =
          new Date()
            .toISOString()
            .split("T")[0];

        localStorage.setItem(
          "lastBackup",
          backupDate
        );

        setLastBackup(
          backupDate
        );

        link.click();

        URL.revokeObjectURL(
          url
        );

      } catch (err) {
        console.error(err);
      }
    };

  const exportBanners =
    async () => {
      try {

        const res =
          await fetch(
            `${API_URL}/api/banners`
          );

        const banners =
          await res.json();

        const blob =
          new Blob(
            [
              JSON.stringify(
                banners,
                null,
                2
              ),
            ],
            {
              type:
                "application/json",
            }
          );

        const url =
          URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download =
          `banners-backup-${new Date()
            .toISOString()
            .split("T")[0]
          }.json`;

        const backupDate =
          new Date()
            .toISOString()
            .split("T")[0];

        localStorage.setItem(
          "lastBackup",
          backupDate
        );

        setLastBackup(
          backupDate
        );

        link.click();

        URL.revokeObjectURL(
          url
        );

      } catch (err) {
        console.error(err);
      }
    };

  const exportAll =
    async () => {
      try {

        const moviesRes =
          await fetch(
            `${API_URL}/api/movies`
          );

        const bannersRes =
          await fetch(
            `${API_URL}/api/banners`
          );

        const movies =
          await moviesRes.json();

        const banners =
          await bannersRes.json();

        const backup = {
          exportDate:
            new Date().toISOString(),

          movies,
          banners,
        };

        const blob =
          new Blob(
            [
              JSON.stringify(
                backup,
                null,
                2
              ),
            ],
            {
              type:
                "application/json",
            }
          );

        const url =
          URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download =
          "full-backup.json";

        const backupDate =
          new Date()
            .toISOString()
            .split("T")[0];

        localStorage.setItem(
          "lastBackup",
          backupDate
        );

        setLastBackup(
          backupDate
        );

        link.click();

        URL.revokeObjectURL(
          url
        );

      } catch (err) {
        console.error(err);
      }
    };

  const importBackup =
    async (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      try {

        const text =
          await file.text();

        const backup =
          JSON.parse(text);

        const res = await fetch(
          `${API_URL}/api/restore`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
            },
            body: JSON.stringify(backup),
          }
        );

        const data = await res.json();

        if (data.success) {
          alert("Restore สำเร็จ");
          window.location.reload();
        } else {
          alert("Restore ไม่สำเร็จ");
        }
      } catch (err) {
        console.error(err);
        alert(
          err.message
        );
      }
    };

  const restoreBackup = async (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    try {

      const text =
        await file.text();

      const backup =
        JSON.parse(text);

      const ok =
        window.confirm(
          "ข้อมูลปัจจุบันจะถูกแทนที่ ต้องการ Restore หรือไม่?"
        );

      if (!ok) return;

      await fetch(
        `${API_URL}/api/restore`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
          },

          body: JSON.stringify(
            backup
          ),
        }
      );

      alert(
        "Restore สำเร็จ"
      );

    } catch (err) {
      console.error(err);

      alert(
        "Restore ไม่สำเร็จ"
      );
    }
  };
  const restoreBackupFile = async (
    filename
  ) => {

    const ok =
      window.confirm(
        `Restore ${filename} ?`
      );

    if (!ok) return;

    try {

      const res =
        await axios.post(
          `${API_URL}/api/restore/file`,
          {
            filename
          },
          {
            headers: {
              authorization: `Bearer ${sessionStorage.getItem("adminToken")}`
            }
          }
        );

      if (
        res.data.success
      ) {

        alert(
          "Restore สำเร็จ"
        );

        window.location.reload();

      }

    } catch (err) {

      console.error(err);

      alert(
        "Restore ไม่สำเร็จ"
      );

    }

  };

  const fetchBackups = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/restore/list`,
        {
          headers: {
            authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
          },
        }
      );

      setBackupFiles(res.data);

    } catch (err) {
      console.error(err);
    }
  };
  const totalBackupPages =
    Math.ceil(
      backupFiles.length /
      BACKUPS_PER_PAGE
    ) || 1;

  const currentBackupFiles =
    backupFiles.slice(
      (backupPage - 1) *
      BACKUPS_PER_PAGE,

      backupPage *
      BACKUPS_PER_PAGE
    );

  const formatBackupDate = (
    filename
  ) => {

    const match =
      filename.match(
        /backup-(\d+)\.json/
      );

    if (!match)
      return "-";

    const timestamp =
      Number(match[1]);

    return new Date(
      timestamp
    ).toLocaleString(
      "th-TH"
    );
  };

  return (
    <div className="admin-page">

      <div className="admin-grid">

        {/* SETTINGS */}

        <div className="admin-card">

          <h2>
            ⚙ System Settings
          </h2>

          <div className="setting-section">

            <h3>
              📥 ระบบสำรองข้อมูล
            </h3>

            <div className="backup-table">

              <div className="backup-row">
                <span>📥 Restore Backup</span>

                <input
                  type="file"
                  accept=".json"
                  onChange={restoreBackup}
                />
              </div>

              <div className="backup-row">
                <span> นำข้อมูลเข้าทั้งหมด</span>
                <label
                  className="submit-btn"
                >
                  Import

                  <input
                    type="file"
                    accept=".json"
                    onChange={
                      importBackup
                    }
                    hidden
                  />
                </label>
              </div>
              <div className="backup-row">

                <span>📦 Full Backup</span>

                <button
                  onClick={exportAll}
                  className="submit-btn"
                >
                  Export
                </button>
              </div>

              <div className="backup-row">
                <span>🎬 สำรองข้อมูลหนัง</span>

                <button
                  onClick={exportMovies}
                  className="submit-btn"
                >
                  Export
                </button>
              </div>

              <div className="backup-row">
                <span>🖼 สำรองข้อมูลแบนเนอร์</span>

                <button
                  onClick={exportBanners}
                  className="submit-btn"
                >
                  Export
                </button>
              </div>

            </div>

          </div>

          <div className="setting-section">

            {/* <h3>
              🎬 Website
            </h3>

            <input
              value={siteName}
              onChange={(e) =>
                setSiteName(
                  e.target.value
                )
              }
            />

            <button
              className="submit-btn"
            >
              บันทึก
            </button> */}

          </div>

        </div>

        {/* INFO */}

        <div className="admin-card">

          <h2>
            📊 สถิติ
          </h2>

          <div className="stats-grid">

            <div className="stat-card">
              <span>🎬</span>

              <h3>
                {movieCount}
              </h3>

              <p>
                หนังทั้งหมด
              </p>
            </div>

            <div className="stat-card">
              <span>🖼</span>

              <h3>
                {bannerCount}
              </h3>

              <p>
                แบนเนอร์
              </p>
            </div>

            <div className="stat-card">
              <span>👥</span>

              <h3>
                {todayVisitors}
              </h3>

              <p>
                ผู้เข้าชมวันนี้
              </p>
            </div>

            <div className="stat-card">
              <span>🌎</span>

              <h3>
                {totalVisitors}
              </h3>

              <p>
                ผู้เข้าชมทั้งหมด
              </p>
            </div>
          </div>

          <div className="backup-info">
            💾 Last Backup

            <span>
              {lastBackup}
            </span>
          </div>

          <div className="setting-section">

            <h3>
              📂 Auto Backup Files
            </h3>

            <div className="backup-table">

              {currentBackupFiles.map((file) => (

                <div className="backup-file-row"
                  key={file}
                >

                  <div
                    className="backup-file-name"
                  >
                    {file}
                  </div>

                  <div
                    className="backup-file-date"
                  >
                    {formatBackupDate(file)}
                  </div>

                  <div
                    className="backup-file-actions"
                  >
                    <button
                      className="submit-btn"
                      onClick={() =>
                        restoreBackupFile(file)
                      }
                    >
                      Restore
                    </button>
                  </div>

                </div>
              ))}
            </div>
            <div className="pagination">
              <button
                disabled={
                  backupPage === 1
                }
                onClick={() =>
                  setBackupPage(
                    backupPage - 1
                  )
                }
              >
                Prev
              </button>

              <span>
                {backupPage}
                {" / "}
                {totalBackupPages}
              </span>

              <button
                disabled={
                  backupPage ===
                  totalBackupPages
                }
                onClick={() =>
                  setBackupPage(
                    backupPage + 1
                  )
                }
              >
                Next
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingManager;