const { getAuth } = require("firebase-admin/auth");
const res = require("express/lib/response");

let uid = "w";

const verifyToken = async (tokenClient) => {
  if (tokenClient) {
    const idToken = tokenClient.split(" ")[1];
    // idToken comes from the client app
    console.log(idToken);
    await getAuth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        uid = decodedToken.uid;
      })
      .catch((error) => {
        console.log(error);
        console.log("invalid token");
        uid = 403;
      });
    return uid;
  } else {
    return 401;
  }
};

module.exports = verifyToken;
