"use client";

import { useRef, useState } from "react";
import TaxiMailLogin from "./taxiMailLogin";
import { TaxiMailGetList, TaxiMailPost } from "@/actions/taxiMail";
import TaxiMailList from "./taxiMailList";

const TaxiiMail = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [dataTaxiMailList, setDataTaxiMailList] = useState<[]>();
  const [sessionID, setSessionID] = useState("");

  //hendleSubmit TaxiMailLogin
  const hendleSubmit = async (data: FormData) => {
    if (data.get("TapiKey") === "" || data.get("TsecretKey") === "") return;

    try {
      setLoading(true);
      const res = await TaxiMailPost(data);
      if (res.code === 201) {
        setLoading(false);
        setSessionID(res.data.session_id);
        //Query TaxiMailList
        const resTaxiMailList = await TaxiMailGetList(res.data.session_id);
        setDataTaxiMailList(resTaxiMailList);
        formRef.current?.reset();
      }
    } catch (error) {
      console.error("Something went wrong!", error);
    }
  };

  const hendleClearData = async () => {
    setDataTaxiMailList(undefined);
  };
  return (
    <div className="border shadow-md rounded-md p-6">
      {dataTaxiMailList === undefined ? (
        <TaxiMailLogin
          formRef={formRef}
          hendleSubmit={hendleSubmit}
          loading={loading}
        />
      ) : (
        <TaxiMailList
          data={dataTaxiMailList}
          sessionID={sessionID}
          hendleClearData={hendleClearData}
        />
      )}
    </div>
  );
};

export default TaxiiMail;
