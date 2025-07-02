const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const params = {
    TableName: "measuringcontest-dummy",
    Item: {
      id: 1,
      value: true
    }
  };

  try {
    await dynamoDb.put(params).promise();
    console.log("Successfully wrote to DynamoDB");

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success: wrote to DynamoDB" }),
    };
  } catch (error) {
    console.error("Error writing to DynamoDB:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error writing to DynamoDB", error }),
    };
  }
};
