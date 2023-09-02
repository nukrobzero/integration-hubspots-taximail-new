"use server";

import { HubSpotType } from "../../typing";

export const TaxiMailPost = async (data: FormData) => {
  const api_key = data.get("TapiKey") as string;
  const secret_key = data.get("TsecretKey") as string;

  const sendData = {
    api_key,
    secret_key,
  };

  const response = await fetch(`https://api.taximail.com/v2/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sendData),
  });

  const resData = await response.json();

  return resData;
};

export const TaxiMailGetList = async (session_id: string) => {
  const response = await fetch(`https://api.taximail.com/v2/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session_id}`,
    },
  });

  const resData = await response.json();

  return resData.data.lists;
};

export const HubspotGetContacts = async (
  data: FormData,
  sessionID: string,
  listId: number
) => {
  const HapiKey = data.get("HapiKey") as string;
  const url = `https://api.hubapi.com/crm/v3/objects/contacts?archived=false&properties=firstname%2Clastname%2Cemail%2Ccompany%2Cphone&limit=100`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${HapiKey}`,
  };

  const checkAPIKEY = await fetch(url, { headers });
  const resCheckAPIKEY = await checkAPIKEY.json();
  if (resCheckAPIKEY.status === "error") {
    return resCheckAPIKEY;
  } else {
    const getContacts = async () => {
      let allContacts: HubSpotType[] = [];
      let after: string | undefined = undefined;

      async function fetchData() {
        const response = await fetch(after ? `${url}&after=${after}` : url, {
          headers,
        });
        const responseData = await response.json();
        // console.log(responseData);
        const { results, paging } = responseData;
        allContacts.push(...results);
        // console.log(allContacts);
        after = paging?.next?.after;

        if (after) {
          // If there's more data to fetch, introduce a second delay before the next call
          await new Promise((resolve) => setTimeout(resolve, 0)); // delay
          await fetchData();
        }
      }
      await fetchData();

      return allContacts;
    };
    const res = await getContacts();
    try {
      // Convert fetched data to Taximail-compatible format
      const subscribersData = res
        .map((result: HubSpotType) => {
          const email = result.properties.email || "[No email]";
          const firstname = result.properties.firstname || "";
          const lastname = result.properties.lastname || "";
          const phone = result.properties.phone || "";
          return `${email},${firstname},${lastname},${phone}`;
        })
        .join("|:|");
      // Import data into Taximail
      const taximailResponse = await fetch(
        `https://api.taximail.com/v2/list/${listId}/subscribers/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionID}`,
          },
          body: JSON.stringify({
            mode_import: "copyandpaste",
            subscribers_data: subscribersData,
            field_terminator: ",",
            matched_fields: ["email", "Firstname", "Lastname"],
            not_send_optin_email: true,
            add_to_suppression_list: "none",
          }),
        }
      );

      const taximailResponseData = await taximailResponse.json();
      return taximailResponseData;
    } catch (error) {
      console.error("Error importing data into Taximail:", error);
    }
  }
};
