/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
// eslint-disable-next-line no-dupe-else-if


const { functions, cors } = require("../application/lib");

const { createNewTask } = require("./createTask");
const { deleteTask } = require("./deleteTask");
const { editTask } = require("./editTask");
const { logWork } = require("./logwork");

exports.tasks = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const mode = request.body.data.mode;

        if (mode == "create") {
            return createNewTask(request, response);
        } else if (mode == "edit") {
            return editTask(request, response);
        } else if (mode == "log") {
            return logWork(request, response);
        } else if (mode == "delete") {
            return deleteTask(request, response);
        }
    });
});