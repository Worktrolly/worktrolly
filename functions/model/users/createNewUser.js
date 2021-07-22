/* eslint-disable object-curly-spacing */
/* eslint-disable no-undef */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
// eslint-disable-next-line no-dupe-else-if

const { setApplication, getApplicationData } = require("../application/lib");
const { setUser, getUser } = require("./lib");

exports.createNewUser = function(request, response) {
    const user = request.body.data;
    const Uid = user.uid;
    const PhotoURL = user.photoURL;
    const DisplayName = user.displayName;
    const Email = user.email;
    const PhoneNumber = user.phoneNumber;
    const ProviderId = user.providerId;

    let status = 200;

    const promise1 = getUser(Uid).then((data) => {
        console.log("Getting User Data");
        if (data == undefined) {
            setUser(Uid, PhotoURL, DisplayName, Email, PhoneNumber, ProviderId);
        }
    }).catch((err) => {
        status = 500;
        console.error("Error : " + err);
    });

    const promise2 = getApplicationData().then((data) => {
        console.log("Getting Application Data");
        if (data == undefined) {
            setApplication();
        }
    }).catch((err) => {
        status = 500;
        console.error("Error : " + err);
    });

    const Promises = [promise1, promise2];
    let result;
    return Promise.all(Promises).then(() => {
            result = { data: "User Logged In Successfully" };
            console.log("User Logged In Successfully");
            return response.status(status).send(result);
        })
        .catch((error) => {
            result = { data: error };
            console.error("Error LogIn/SignUp User", error);
            return response.status(status).send(result);
        });
};