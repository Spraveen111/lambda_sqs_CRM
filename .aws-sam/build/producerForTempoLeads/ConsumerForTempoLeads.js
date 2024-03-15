const axios = require("axios");

exports.handler = async (event) => {
  // const body = JSON.parse(event.body);
  try {
    console.log("data123====>", JSON.parse(event.Records[0].body));
    const body = JSON.parse(event.Records[0].body);
    console.log("tempo-Body===>", {...body});
    const { firstName, lastName, email, phoneNumber } = body;
    
    console.log("tempo-Body123===>", {...body});
    const response = await axios.post(
      "https://sravs.clienttempo.com/externalApiAdapters/addTempocrmLeads_c2198267b2464b4993aff6a262b27032",
      {
        apiKey: "c2198267-b246-4b49-93af-f6a262b27032",
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response=======>", response);

    console.log("Lambda Function triggered successfully");
    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error("Error triggering Lambda Function:", error);
    return { statusCode: 400 };
  }
};
