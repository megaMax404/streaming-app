import { useEffect, useState } from "react";
import "../styles/Visitors.css";
import { getVisitors } from "../services/siteService";

function Visitors() {

    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);

    const [search, setSearch] = useState("");

    const [data, setData] = useState({
        visitors: [],
        total: 0,
        page: 1,
        limit: 20
    });

    async function load(currentPage = page) {

        setLoading(true);

        try {

            const res = await getVisitors(
                currentPage,
                20,
                search
            );

            setData(res);

        } catch (err) {

            console.error(err);

        }

        setLoading(false);

    }

    useEffect(() => {

        load(page);

    }, [page]);

    function handleSearch(e) {

        e.preventDefault();

        setPage(1);

        load(1);

    }

    const totalPages = Math.ceil(
        data.total / data.limit
    );

    return (

        <div className="visitor-page">

            <div className="visitor-header">

                <div className="visitor-title">

                    👥 Visitor Analytics

                </div>

            </div>

            <div className="visitor-summary">

                <div className="visitor-card">

                    <small>Total Visitors</small>

                    <strong>

                        {data.total}

                    </strong>

                </div>

                <div className="visitor-card">

                    <small>Current Page</small>

                    <strong>

                        {page}

                    </strong>

                </div>

                <div className="visitor-card">

                    <small>Visitors Loaded</small>

                    <strong>

                        {data.visitors.length}

                    </strong>

                </div>

                <div className="visitor-card">

                    <small>Pages</small>

                    <strong>

                        {totalPages}

                    </strong>

                </div>

            </div>

            <form
                className="visitor-search"
                onSubmit={handleSearch}
            >
                <input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />
                <button>
                    Search
                </button>
            </form>
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
                                <th>Country</th>
                                <th>City</th>
                                <th>Browser</th>
                                <th>Platform</th>
                                <th>Language</th>
                                <th>Visit</th>
                                <th>Last Seen</th>
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
                                                    new Date(
                                                        v.lastSeen
                                                    ).toLocaleString()
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