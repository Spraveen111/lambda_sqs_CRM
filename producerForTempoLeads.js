const AWS = require("aws-sdk");

// Set the region
AWS.config.update({ region: "REGION" });

exports.handler = async (event) => {
  try {
    let sqs = new AWS.SQS({ apiVersion: "latest" });
    const body = JSON.parse(event.body);
    console.log("data123====>", body);
    console.log("QUEURL", process.env.INVOCATION_QUEUE_URL);

    const params = {
      MessageBody: JSON.stringify(body),
      QueueUrl: process.env.INVOCATION_QUEUE_URL,
      // MessageGroupId: uuidv4(),
    };

    const sendMessage = (params) => {
      return new Promise((resolve, reject) => {
        sqs.sendMessage(params, (err, data) => {
          if (err) {  
            console.log(`Error sending message ${err}`);

            reject(new Error("Error in sending message to the queue"));
          } else {
            console.log(`Message sent successfully: ${data}`);

            resolve("Message sent to the queue");
          }
        });
      });
    };

    async function sendSQSMessage(params) {
      try {
        const message = await sendMessage(params);

        console.log(message);

        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            status: 200,
            message: "Data Send successfully",
            DataMessagetoSqs: "Message sent to the queue",
          }),
        };
      } catch (error) {
        console.log(`Error sending message ${error}`);

        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            status: 400,
            message: "Data sending Error",
            DataMessagetoSqs: "Error in sending message to the queue",
          }),
        };
      }
    }

    const response = await sendSQSMessage(params);

    console.log("Lambda Function triggered successfully");
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error triggering Lambda Function:", error);
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        status: 400,
        message: "Data sending Error",
        DataMessagetoSqs: "Error in sending message to the queue",
      }),
    };
  }
};
