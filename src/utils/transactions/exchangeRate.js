export const formatRate = (rate) => String(Number(Number(rate).toFixed(6)));

export const roundMoney = (value) => Math.round(Number(value) * 100) / 100;

export const sentFromReceived = (received, rate) => 
    Number(received) > 0 && Number(rate) > 0 ? roundMoney(Number(received) / Number(rate)) : "";