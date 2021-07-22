/* eslint-disable linebreak-style */
/* eslint-disable no-var */
/* eslint-disable object-curly-spacing */
/* eslint-disable no-undef */
/* eslint-disable require-jsdoc */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
// eslint-disable-next-line no-dupe-else-if

const admin = require("firebase-admin");
const { updateTask } = require("../tasks/lib");

const db = admin.firestore();
exports.patch2 = function(request, response) {
    const orgDomain = request.body.data.OrgDomain;
    let taskId;
    const newfield = request.body.data.newField;
    const newFieldValue = request.body.data.NewFieldValue;
    const promise1 = db.collection("Organizations").doc(orgDomain).collection("Tasks").get().then((task) => {
        task.forEach((doc) => {
            taskId = doc.data().Id;
            console.log("Executing Promise1 of Patch2");
            data = {};
            data[newfield] = newFieldValue;
            updateTask(data, orgDomain, taskId);
        });
        const Promises = [promise1];
        Promise.all(Promises).then(() => {
            result = { data: "OK! Patch2 executed" };
            console.log("Counters updated");
            return response.status(200).send(result);
        }).catch(function(error) {
            result = { data: error };
            console.error("Patch error in updating counters", error);
            return response.status(500).send(result);
        });
    });
};