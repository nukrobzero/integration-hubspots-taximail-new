"use client";

import { HubspotGetContacts } from "@/actions/taxiMail";
import { Loader2 } from "lucide-react";
import { FC, Fragment, useRef, useState } from "react";

type DataType = {
  list_id: string;
  list_name: string;
};

type DataProps = {
  data: DataType[];
  sessionID: string;
  hendleClearData: () => void;
};

const TaxiMailList: FC<DataProps> = ({ data, sessionID, hendleClearData }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loadingSuccess, setLoadingSuccess] = useState(false);
  const [listId, setListId] = useState("");
  const [loadinga, setLoadinga] = useState(0);
  const [wrongHubKey, setWrongHubKey] = useState("");
  //hendleSubmit Integrations hubSpot to TaxiMail
  const hendleSubmit1 = async (data: FormData) => {
    if (
      data.get("HapiKey") === "" ||
      data.get("TSessionID") === "" ||
      listId === "" ||
      sessionID === ""
    ) {
      return;
    }
    setLoadinga(1);
    try {
      const resContact = await HubspotGetContacts(data, sessionID, listId);
      if (resContact.code === 201) {
        formRef.current?.reset();
        setLoadinga(0);
        setLoadingSuccess(true);
      }
    } catch (error) {
      console.error("Something went wrong!", error);
      setLoadinga(0);
      setWrongHubKey("Something went wrong!,HubSpot Key Incorrent");
    }
  };
  console.log(loadinga);
  return (
    <div>
      {loadingSuccess === false ? (
        <div>
          <h1>TaxiMailList: (default: First Import )</h1>
          <div className="flex flex-col justify-center items-start py-2">
            <select
              onChange={(e) => setListId(e.target.value)}
              required
              className="border border-slate-400 rounded-md p-2"
            >
              <option>==== Please Select ====</option>
              {data.map((data: DataType) => (
                <option key={data.list_id} value={data.list_id}>
                  {data.list_name}
                </option>
              ))}
            </select>
          </div>
          {listId !== "" ? (
            <form
              ref={formRef}
              action={hendleSubmit1}
              className="flex flex-col justify-start items-start space-y-2 w-full"
            >
              <Fragment>
                <label htmlFor="TsecretKey">HUBSPOT KEY:</label>
                <input
                  type="password"
                  name="HapiKey"
                  required
                  className="border border-slate-400 rounded-md p-2 w-full"
                />
                {wrongHubKey ? (
                  <span className="text-red-700 text-xs">{wrongHubKey}</span>
                ) : (
                  ""
                )}
              </Fragment>
              <div className="flex justify-center items-center w-full py-6">
                <button
                  type="submit"
                  disabled={loadinga === 1}
                  className={`border border-slate-400 hover:border-white px-4 py-2 rounded-md hover:bg-blue-500 hover:text-neutral-100 transition-all duration-300 ease-in-out ${
                    loadinga === 1 ? "bg-blue-500" : ""
                  }`}
                >
                  {loadinga === 1 ? (
                    <span className="flex justify-center items-center text-white">
                      <Loader2 className="animate-spin mr-2" />
                      Loading...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          ) : (
            ""
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center space-y-4 p-16">
          <h1>Successfully</h1>
          <button
            onClick={hendleClearData}
            className="border border-slate-400 hover:border-white px-4 py-2 rounded-md hover:bg-blue-500 hover:text-neutral-100 transition-all duration-300 ease-in-out"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default TaxiMailList;
