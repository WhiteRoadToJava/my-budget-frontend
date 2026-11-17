import api from "./axios"


export const getLatestRate = async(from, to) => {
    const response = await api.get("/user/exchange-rates/latest", {params: {from, to}});
    return response.status === 204 || !response.data ? null : response.data;
};

export const getExchangeRates = async() => {
    const response = await api.get("/user/exchange-rates");
    return response.data;
};

export const addExchangeRate = async(rate) => {
    const response = await api.post("/user/exchange-rates", rate);
    return response.data;
};

export const deleteExchangeRate = async(id) => {
    await api.delete(`/user/exchange-rates/${id}`);
};