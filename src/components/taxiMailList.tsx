"use client";

import { Loader2 } from "lucide-react";
import { FC, Fragment, RefObject } from "react";

type DataType = {
  list_id: number;
  list_name: string;
};

type DataProps = {
  formRef: RefObject<HTMLFormElement>;
  data: DataType[];
  loadingSuccess: boolean;
  listId: number;
  wrongHubKey: string;
  loading: boolean;
  hendleSubmitTaxiMailList: (data: FormData) => void;
  hendleClearData: () => void;
};

const TaxiMailList: FC<DataProps> = ({
  formRef,
  data,
  loadingSuccess,
  listId,
  wrongHubKey,
  loading,
  hendleSubmitTaxiMailList,
  hendleClearData,
}) => {
  const targetListId = listId; // Replace this with the desired list_id
  const foundItem = data.find(
    (item: DataType) => item.list_id === targetListId
  );

  return (
    <div>
      {loadingSuccess === false ? (
        <div>
          <h1>TaxiMailList: (default: First Import )</h1>
          <div className="flex flex-col justify-center items-start py-2">
            <select
              value={targetListId}
              onChange={() => null}
              required
              disabled={loading === true}
              className="border border-slate-400 rounded-md p-2 w-full"
            >
              <option value={foundItem?.list_id}>{foundItem?.list_name}</option>
            </select>
          </div>
          <form
            ref={formRef}
            action={hendleSubmitTaxiMailList}
            className="flex flex-col justify-start items-start space-y-2 w-full"
          >
            <Fragment>
              <label htmlFor="TsecretKey">HUBSPOT KEY:</label>
              <input
                type="password"
                name="HapiKey"
                required
                disabled={loading === true}
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
                disabled={loading === true}
                className={`border border-slate-400 hover:border-white px-4 py-2 rounded-md hover:bg-blue-500 hover:text-neutral-100 transition-all duration-300 ease-in-out ${
                  loading === true ? "bg-blue-500" : ""
                }`}
              >
                {loading === true ? (
                  <span className="flex justify-center items-center text-white">
                    <Loader2 className="animate-spin mr-2" />
                    Loading...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
            {loading === true ? (
              <span className="text-red-700 text-xs font-semibold">
                This process may take more than 10 minutes. Please wait.
              </span>
            ) : (
              ""
            )}
          </form>
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
