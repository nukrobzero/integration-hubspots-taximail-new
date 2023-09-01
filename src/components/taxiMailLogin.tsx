"use client";

import { Loader2 } from "lucide-react";
import { FC, Fragment, RefObject } from "react";

type DataProps = {
  hendleSubmit: (data: FormData) => void;
  formRef: RefObject<HTMLFormElement>;
  loading: boolean;
  wrongKey: string;
};

const TaxiMailLogin: FC<DataProps> = ({
  hendleSubmit,
  formRef,
  loading,
  wrongKey,
}) => {
  return (
    <form
      ref={formRef}
      action={hendleSubmit}
      className="flex flex-col justify-start items-start space-y-2"
    >
      <Fragment>
        <label htmlFor="TapiKey">Taximail API Key:</label>
        <input
          type="password"
          name="TapiKey"
          required
          className="border border-slate-400 rounded-md p-2 w-full"
        />
      </Fragment>
      <Fragment>
        <label htmlFor="TsecretKey">Taximail Secret Key:</label>
        <input
          type="password"
          name="TsecretKey"
          required
          className="border border-slate-400 rounded-md p-2 w-full"
        />
      </Fragment>
      {wrongKey ? <span className="text-red-700 text-xs">{wrongKey}</span> : ""}
      <div className="flex justify-center items-center w-full py-6">
        <button
          type="submit"
          disabled={loading}
          className={`border border-slate-400 hover:border-white px-4 py-2 rounded-md hover:bg-blue-500 hover:text-neutral-100 transition-all duration-300 ease-in-out ${
            loading ? "bg-blue-500" : ""
          }`}
        >
          {loading ? (
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
  );
};

export default TaxiMailLogin;
