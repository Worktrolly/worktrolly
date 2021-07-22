/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
// eslint-disable-next-line no-dupe-else-if

const { functions, cors } = require("../application/lib");
const { createNewUser } = require("./createNewUser");
const { updateUser } = require("./updateUser");
const { updateTheme } = require("../../updateUserProfileAPI");
const { verifyUser } = require("./verifyUser");

exports.users = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const mode = request.body.data.mode;

        if (mode == "create") {
            return createNewUser(request, response);
        } else if (mode == "update") {
            return updateUser(request, response);
        } else if (mode == "update-theme") {
            return updateTheme(request, response);
        } else if (mode == "verify") {
            return verifyUser(request, response);
        }
    });
});