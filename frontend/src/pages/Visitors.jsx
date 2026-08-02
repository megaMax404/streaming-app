import { useEffect, useState } from "react";
import { getVisitors } from "../services/siteService";

function Visitors() {

    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadVisitors() {

            try {

                const data = await getVisitors();

                setVisitors(data.visitors);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        }

        loadVisitors();

    }, []);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (

        <div className="container py-4">

            <h2 className="mb-4">
                Visitor List
            </h2>

            <table className="table table-bordered table-striped">

                <thead>

                    <tr>

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

                    {visitors.map((v) => (

                        <tr key={v._id}>

                            <td>{v.country}</td>

                            <td>{v.city}</td>

                            <td>{v.browser || "-"}</td>

                            <td>{v.platform || "-"}</td>

                            <td>{v.language || "-"}</td>

                            <td>{v.visitCount}</td>

                            <td>
                                {new Date(v.lastSeen).toLocaleString()}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default Visitors;