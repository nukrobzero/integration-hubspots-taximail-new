"use client";

import { useRef, useState, useTransition } from "react";
import TaxiMailLogin from "./taxiMailLogin";
import {
  HubspotGetContacts,
  TaxiMailGetList,
  TaxiMailPost,
} from "@/actions/taxiMail";
import TaxiMailList from "./taxiMailList";

const TaxiiMail = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [dataTaxiMailList, setDataTaxiMailList] = useState<[]>();
  const [sessionID, setSessionID] = useState("");

  const [listId, setListId] = useState(265);
  const [wrongKey, setWrongKey] = useState("");
  const [loadingSuccess, setLoadingSuccess] = useState(false);

  //hendleSubmit TaxiMailLogin
  const hendleSubmit = async (data: FormData) => {
    setWrongKey("");
    setLoading(true);
    if (data.get("TapiKey") === "" || data.get("TsecretKey") === "") {
      setLoading(false);
      return;
    } else {
      setTimeout(async () => {
        try {
          const res = await TaxiMailPost(data);
          if (res.status === "error") {
            setWrongKey(res.err_msg);
            setLoading(false);
            formRef.current?.reset();
          } else {
            setWrongKey("");
            setLoading(false);
            setSessionID(res.data.session_id);
            //Query TaxiMailList
            const resTaxiMailList = await TaxiMailGetList(res.data.session_id);
            setDataTaxiMailList(resTaxiMailList);
            formRef.current?.reset();
          }
        } catch (error) {
          console.error("Something went wrong!", error);
          setWrongKey("Something went wrong!");
          setLoading(false);
          formRef.current?.reset();
        }
      }, 2000);
    }
  };

  //hendleSubmit Integrations hubSpot to TaxiMail
  const hendleSubmitTaxiMailList = async (data: FormData) => {
    setWrongKey("");
    setLoading(true);
    if (
      data.get("HapiKey") === "" ||
      data.get("TSessionID") === "" ||
      sessionID === ""
    ) {
      setLoading(false);
      return;
    } else {
      setTimeout(async () => {
        try {
          const resContact = await HubspotGetContacts(data, sessionID, listId);
          if (resContact.status === "error") {
            formRef.current?.reset();
            setLoading(false);
            setWrongKey("HubSpot Key Incorrent!");
          } else {
            console.log(resContact);
            setLoading(true);
            setLoadingSuccess(true);
          }
        } catch (error) {
          console.error("Something went wrong!", error);
          formRef.current?.reset();
          setLoading(false);
          setWrongKey("HubSpot Key Incorrent!");
        }
      }, 2000);
    }
  };

  const hendleClearData = async () => {
    setDataTaxiMailList(undefined);
    setLoading(false);
    setSessionID("");
    setLoadingSuccess(false);
  };
  return (
    <div className="border shadow-md rounded-md p-6">
      {dataTaxiMailList === undefined ? (
        <TaxiMailLogin
          formRef={formRef}
          hendleSubmit={hendleSubmit}
          loading={loading}
          wrongKey={wrongKey}
        />
      ) : (
        <TaxiMailList
          formRef={formRef}
          data={dataTaxiMailList}
          loadingSuccess={loadingSuccess}
          listId={listId}
          wrongHubKey={wrongKey}
          loading={loading}
          hendleSubmitTaxiMailList={hendleSubmitTaxiMailList}
          hendleClearData={hendleClearData}
        />
      )}
    </div>
  );
};

export default TaxiiMail;
