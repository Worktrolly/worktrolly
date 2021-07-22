// /* eslint-disable no-undef */

/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
// const admin = require("firebase-admin");
// const db = admin.firestore();

const { db } = require("../application/lib");

exports.setSprint = function(orgDomain, teamName, fullSprintName, orgId, teamId, newSprintId, status, totalNumberOfTask = 0, totalUnCompletedTask = 0, startDate = "xxxx-xx-xx", endDate = "xxxx-xx-xx") {
    const setSprint = db.collection("Organizations").doc(orgDomain).collection("Teams").doc(teamName).collection("Sprints").doc(fullSprintName).set({
        OrganizationId: orgId,
        TeamId: teamId,
        SprintNumber: newSprintId,
        TotalCompletedTask: 0,
        TotalNumberOfTask: totalNumberOfTask,
        TotalUnCompletedTask: totalUnCompletedTask,
        StartDate: startDate,
        EndDate: endDate,
        Status: status,
    });
    return Promise.resolve(setSprint);
};

exports.updateSprint = function(inputJson, orgDomain, teamName, fullSprintName) {
    const updateSprint = db.collection("Organizations").doc(orgDomain).collection("Teams").doc(teamName).collection("Sprints").doc(fullSprintName).update(inputJson);

    return Promise.resolve(updateSprint);
};

exports.getSprint = function(orgDomain, teamName, fullSprintName) {
    const getSrpintDetails = db.collection("Organizations").doc(orgDomain).collection("Teams").doc(teamName).collection("Sprints").doc(fullSprintName).get().then((sprint) => {
        if (sprint.exists) return sprint.data();
        else return;
    });
    return Promise.resolve(getSrpintDetails);
};