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
                    <h3>🌍 Page Views</h3>
                    <span>{today?.pageViews || 0}</span>
                </div>

                <div className="statistics-card">
                    <h3>👥 Visitors Today</h3>
                    <span>{today?.todayVisitors || 0}</span>
                </div>

                <div className="statistics-card">
                    <h3>🟢 Online Now</h3>
                    <span>{today?.onlineNow || 0}</span>
                </div>

                <div className="statistics-card">
                    <h3>🎬 Movie Views</h3>
                    <span>{today?.movieViews || 0}</span>
                </div>

            </div>

            <hr />

            <AnalyticsChart history={history} />

            <hr />
            
            <h3>ย้อนหลัง</h3>

            <table className="statistics-table">
                <thead>
                    <tr>
                        <th>วันที่</th>
                        <th>Page Views</th>
                        <th>Visitors</th>
                        <th>Movie Views</th>
                    </tr>
                </thead>

                <tbody>

                    {history.map((item) => (

                        <tr key={item._id}>
                            <td>{item.date}</td>
                            <td>{item.pageViews}</td>
                            <td>{item.uniqueVisitors}</td>
                            <td>{item.movieViews}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>


    );
}

export default StatisticsManager;