/* eslint-disable object-curly-spacing */
/* eslint-disable no-undef */
/* eslint-disable require-jsdoc */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
// eslint-disable-next-line no-dupe-else-if
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

const admin = require("firebase-admin");

const db = admin.firestore();

exports.createNewUser = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const user = request.body.data;
        const Uid = user.uid;
        const PhotoURL = user.photoURL;
        const DisplayName = user.displayName;
        const Email = user.email;
        const PhoneNumber = user.phoneNumber ? user.phoneNumber : "";
        const ProviderId = user.providerId;

        console.log(user);
        const promise1 = db.collection("Users").doc(Uid).get().then((doc) => {
            if (!doc.exists) {
                const userData = db.collection("Users").doc(Uid).set({
                    AppKey: "",
                    TeamId: "",
                    uid: Uid,
                    photoURL: PhotoURL,
                    displayName: DisplayName,
                    email: Email,
                    phoneNumber: PhoneNumber,
                    providerId: ProviderId,
                    AboutMe: "",
                    AppTheme: "theme-light",
                    GithubProfile: "",
                    LinkedInProfile: "",
                    DateOfJoining: "",
                });
                return Promise.resolve(userData);
            } else {
                return;
            }
        });
        const promise2 = db.collection("RawData").doc("AppDetails").get().then((doc) => {
            if (doc.exists) {
                return 0;
            } else {
                const P1 = db.collection("RawData").doc("AppDetails").set({
                    CurrentSprintId: 0,
                    TotalDevelopmentTask: 0,
                    TotalBusinessTask: 0,
                    TotalMarketingTask: 0,
                    TotalOtherTask: 0,
                    TotalNumberOfTask: 0,
                    TotalCompletedTask: 0,
                    TotalUnCompletedTask: 0,
                    TotalNumberOfOrganizations: 0,
                });
                return Promise.resolve(P1);
            }
        });
        const Promises = [promise1, promise2];
        let result;
        return Promise.all(Promises).then(() => {
                result = { data: "User Logged In Successfully" };
                console.log("User Logged In Successfully");
                return response.status(200).send(result);
            })
            .catch((error) => {
                result = { data: error };
                console.error("Error LogIn/SignUp User", error);
                return response.status(500).send(result);
            });
    });
});