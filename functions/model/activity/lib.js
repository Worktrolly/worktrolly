/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */

const { db } = require("../application/lib");

exports.setActivities = function(orgDomain, taskId, totalActions = 0, totalComments = 0) {
    const setActivityPromise = db.collection("Organizations").doc(orgDomain).collection("Activity").doc(taskId).set({
        TaskId: taskId,
        TotalActions: totalActions,
        TotalComments: totalComments,
    });
    return Promise.resolve(setActivityPromise);
};

exports.updateActivities = function(inputJson, orgDomain, taskId) {
    const updateActivitiesPromise = db.collection("Organizations").doc(orgDomain).collection("Activity").doc(taskId).update(inputJson);

    return Promise.resolve(updateActivitiesPromise);
};

exports.getActivities = function(orgDomain, taskId) {
    const getActivitiesPromise = db.collection("Organizations").doc(orgDomain).collection("Activity").doc(taskId).get().then((doc) => {
        if (doc.exists) {
            return doc.data();
        } else {
            return;
        }
    });

    return Promise.resolve(getActivitiesPromise);
};

exports.setAction = function(orgDomain, taskId, actionId, type, comment, date, time) {
    const setActionPromise = db.collection("Organizations").doc(orgDomain).collection("Activity").doc(taskId).collection("Action").doc(actionId).set({
        Type: type,
        Comment: comment,
        Date: date,
        Time: time,
    });

    return Promise.resolve(setActionPromise);
};