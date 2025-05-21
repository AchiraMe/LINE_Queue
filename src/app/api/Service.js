import axios from 'axios';

var config = { headers: { "Accept": "application/json" } };
const Url = process.env.API_URL1;
// const Url = process.env.API_URL2;

export default class Service {
    // Get Token JWT
    gettoken = async (emp_code, emp_pass) => {
        let data = '';
        let formData = new FormData();
        formData.append("method", "tokeninfo");
        formData.append("emp_code", emp_code);
        formData.append("emp_pass", emp_pass);
        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    // Get Authen
    getuserinfo = async (token) => {
        var config = {
            headers: {
                "Accept": "application/json",
                "Authorization": token
            }
        };
        let data = '';
        let formData = new FormData();
        formData.append("method", "getuserinfo");
        try {
            data = await axios.post(Url, formData, config);
        } catch (e) {
        }
        return data;
    }
    registerLineUser = async (name, lineId) => {
        let data = '';
        let formData = new FormData();
        formData.append("name", name);
        formData.append("lineId", lineId);

        try {
            data = await axios.post("/api/register", formData, {
                headers: { "Accept": "application/json" }
            });
        } catch (e) {
            console.error("Register Error:", e);
        }
        return data;
    }


}
