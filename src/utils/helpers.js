import axios from "axios";

export const createUserMessage = (message) => {
  return {
    text: message,
    sender: "USER",
    messageType: "text",
    ts: new Date(),
  };
};

export const getBotResponse = async ({
  rasaServerUrl,
  sender,
  message,
  metadata = {},
}) => {
  try {
    const response = await axios({
      method: "post",
      url: rasaServerUrl,
      data: {
        "sender": sender,
        "message": message,
        "metadata": metadata,
      },
      headers: {'Content-Type': 'application/json'},
    });
    return response.data;
  } catch (error) {
    console.log("error occurred fetching bot response", error, sender, message, {
      "sender": sender,
      "message": message,
      "metadata": metadata,
    });
    return [];
  }
};
