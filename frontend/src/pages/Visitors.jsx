import { useEffect, useState } from "react";
import "../styles/Visitors.css";
import { getVisitors } from "../services/siteService";

function Visitors() {
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedDate, setSelectedDate] = useState("");
    const [data, setData] = useState({
        visitors: [],
        total: 0,
        page: 1,
        limit: 20
    });

    const fetchVisitors = async (
        currentPage = 1,
        date = selectedDate
    ) => {

        setLoading(true);

        try {
            const res = await getVisitors(
                currentPage,
                20,
                date
            );
            setData(res);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };


    useEffect(() => {

        fetchVisitors(
            page,
            selectedDate
        );

    }, [page, selectedDate]);



    const totalPages = Math.ceil(
        data.total / data.limit
    );

    return (

        <div className="visitor-page">

            <div className="visitor-header">

                <div className="visitor-title">

                    👥 วิเคาห์ข้อมูลผู้เข้าชม

                </div>

            </div>

            <div className="visitor-summary">

                <div className="visitor-card">

                    <small>จำนวนผู้เข้าชมทั้งหมด</small>

                    <strong>

                        {data.total}

                    </strong>

                </div>

            </div>

            <div className="visitor-toolbar">

                <div className="visitor-date-box">

                    <label>📅 วันที่</label>

                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setPage(1);
                        }}
                    />

                    <button
                        onClick={() => {
                            setSelectedDate("");
                            setPage(1);
                        }}
                    >
                        ↺ รีเซ็ต
                    </button>
                </div>
            </div>

            {
                loading ?
                    <h3>
                        Loading...
                    </h3>
                    :
                    <table className="visitor-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ประเทศ</th>
                                <th>เมือง</th>
                                <th>เว็บ</th>
                                <th>อุปกรณ์</th>
                                <th>ภาษา</th>
                                <th>เยี่ยมชม</th>
                                <th>วันที่</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.visitors.map(
                                    (v, index) => (
                                        <tr
                                            key={v._id}
                                        >
                                            <td>
                                                {
                                                    (page - 1) *
                                                    data.limit +
                                                    index +
                                                    1
                                                }
                                            </td>
                                            <td>
                                                <span
                                                    className="country-badge"
                                                >
                                                    {
                                                        v.country ||
                                                        "-"
                                                    }
                                                </span>
                                            </td>
                                            <td>
                                                {
                                                    v.city ||
                                                    "-"
                                                }
                                            </td>
                                            <td>
                                                {
                                                    v.browser
                                                        ?
                                                        v.browser.split(" ")[0]
                                                        :
                                                        "-"
                                                }
                                            </td>
                                            <td>
                                                {
                                                    v.platform ||
                                                    "-"
                                                }
                                            </td>
                                            <td>
                                                {
                                                    v.language ||
                                                    "-"
                                                }
                                            </td>
                                            <td>
                                                <span
                                                    className="visit-badge"
                                                >
                                                    {
                                                        v.visitCount
                                                    }
                                                </span>
                                            </td>
                                            <td>
                                                {
                                                    new Date(v.lastSeen).toLocaleString("th-TH", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        second: "2-digit",
                                                    })
                                                }
                                            </td>
                                        </tr>
                                    )
                                )
                            }
                        </tbody>
                    </table>
            }

            <div className="pagination-box">
                <button
                    disabled={page <= 1}
                    onClick={() =>
                        setPage(page - 1)
                    }
                >
                    ◀ Previous
                </button>
                <button>
                    {page} / {totalPages}
                </button>
                <button
                    disabled={
                        page >= totalPages
                    }
                    onClick={() =>
                        setPage(page + 1)
                    }
                >
                    Next ▶
                </button>
            </div>
        </div>
    );

}

export default Visitors;