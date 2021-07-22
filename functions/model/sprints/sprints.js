/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
// eslint-disable-next-line no-dupe-else-if

const { functions, cors } = require("../application/lib");
const { createNewSprint } = require("./createNewSprint");
const { updateSprintStatus } = require("./updateSprintStatus");

exports.sprints = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const mode = request.body.data.mode;
        if (mode == "create") {
            return createNewSprint(request, response);
        } else if (mode == "update") {
            return updateSprintStatus(request, response);
        }
    });
});