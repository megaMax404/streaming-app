import axios from "axios";
import { API_URL } from "../config";

export async function getVisitors(
    page = 1,
    limit = 20,
    search = ""
) {

    const res = await axios.get(
        `${API_URL}/api/site/visitors`,
        {
            params: {
                page,
                limit,
                search
            }
        }
    );

    return res.data;

}