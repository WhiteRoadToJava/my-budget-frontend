import React, { useState } from "react";
import { getTransactionsBetweenTwoDates} from "../../api/rapportService";
import RapportComponent from "../../components/rapplorts/RapportComponent";

const RapportPage = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState([]);

  const handleSearch = async () => {
    if (fromDate && toDate) {
      const data = await getTransactionsBetweenTwoDates(fromDate, toDate);
      setData(data);
      console.log("date data:", data);
      return data;
    }
  };


  return (
    <div>
      <RapportComponent
        data={data}
        setFromDate={setFromDate}
        setToDate={setToDate}
        search={handleSearch}
      />
    </div>
  );
};

export default RapportPage;
