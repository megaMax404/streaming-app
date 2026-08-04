import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import AnalyticsChart from "./AnalyticsChart";

function StatisticsManager() {
    const [today, setToday] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const todayRes = await axios.get(
                `${API_URL}/api/site/stats`
            );

            const historyRes = await axios.get(
                `${API_URL}/api/site/history`
            );

            setToday(todayRes.data);
            setHistory(historyRes.data);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="statistics-page">

            <h2>📊 Website Statistics</h2>

            <div className="statistics-cards">

                <div className="statistics-card">
                    <h3>🌍 จำนวนการเข้าชมหน้าเว็บ</h3>
                    <span>{today?.pageViews || 0}</span>
                </div>

                <div className="statistics-card">
                    <h3>👥 เยี่ยมชม วันนี้</h3>
                    <span>{today?.todayVisitors || 0}</span>
                </div>

                <div className="statistics-card">
                    <h3>🟢 ออนไลน์ตอนนี้</h3>
                    <span>{today?.onlineNow || 0}</span>
                </div>

                <div className="statistics-card">
                    <h3>🎬 ยอดเข้าชมหนัง</h3>
                    <span>{today?.movieViews || 0}</span>
                </div>

            </div>

            <hr />

            <AnalyticsChart history={history} />

            <hr />
            
        </div>


    );
}

export default StatisticsManager;