"use server";

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
  listId: string
) => {
  const HapiKey = data.get("HapiKey") as string;
  console.log(HapiKey, "|", sessionID, "|", listId);
  const url = `https://api.hubapi.com/crm/v3/objects/contacts`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${HapiKey}`,
  };

  let allContacts: {
    properties: {
      email?: { value?: string };
      firstname?: { value?: string };
      lastname?: { value?: string };
      phone?: { value?: string };
    };
  }[] = [];

  let after: string | undefined = undefined;
  do {
    const response = await fetch(after ? `${url}?after=${after}` : url, {
      headers,
    });
    const responseData = await response.json();
    const { results, paging } = responseData;

    allContacts.push(...results);
    after = paging?.next?.after;
  } while (after);

  try {
    // Convert fetched data to Taximail-compatible format
    const subscribersData = allContacts
      .map((result: any) => {
        const email = result.properties.email?.value || "[No email]";
        const firstname = result.properties.firstname?.value || "";
        const lastname = result.properties.lastname?.value || "";
        const phone = result.properties.phone?.value || "";
        return `${email},${firstname},${lastname},${phone}`;
      })
      .join("|:|");

    // Import data into Taximail
    const taximailResponse = await fetch(
      `https://api.taximail.com/v2/list/${listId}/subscribers/import`,
      {
        method: "POST", // Specify the HTTP method
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
};
