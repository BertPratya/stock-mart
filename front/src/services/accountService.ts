import axios, { AxiosRequestConfig } from "axios";
const serverAddr = "http://localhost:5092/api"


export const registerUser = async (email: string, password: string) => {
    try {
        const data = { userName: email, email: email, password: password };
        const options: AxiosRequestConfig = {
            method: "POST",
            url: `${serverAddr}/Account/register`,
            headers: { "Content-Type": "application/json" },
            withCredentials: false,
            data: data
        };

        const response = await axios.request(options);
        console.log(response.data)
        return response.data

    } catch (err: any) {
        throw err;
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const data = {  email: email, password: password };
        const options: AxiosRequestConfig = {
            method: "POST",
            url: `${serverAddr}/Account/login`,
            headers: { "Content-Type": "application/json" },
            withCredentials: false,
            data: data
        };

        const response = await axios.request(options);
        console.log(response.data)
        return response.data

    } catch (err: any) {
        throw err;
    }
};