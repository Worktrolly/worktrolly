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

exports.patch3 = function(request, response) {
    const orgDomain = request.body.data.OrgDomain;
    const oldField = request.body.data.FieldName;
    const oldFieldValue = request.body.data.FieldValue;
    const newField = request.body.data.NewField;
    const newFieldValue = request.body.data.NewFieldValue;
    let taskId;

    const promise1 = db.collection("Organizations").doc(orgDomain).collection("Tasks").where(oldField, "==", oldFieldValue).get().then((task) => {
        task.forEach((doc) => {
            taskId = doc.data().Id;
            console.log("Executing Promise2 of Patch3");
            data = {};
            data[newField] = newFieldValue;
            updateTask(data, orgDomain, taskId);
        });
        const Promises = [promise1];
        Promise.all(Promises).then(() => {
            result = { data: "OK! Patch3 executed" };
            console.log("updated");
            return response.status(200).send(result);
        }).catch(function(error) {
            result = { data: error };
            console.error("Patch error in updating value", error);
            return response.status(500).send(result);
        });
    });
};