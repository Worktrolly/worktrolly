/* eslint-disable no-undef */

/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
// const admin = require("firebase-admin");
// const db = admin.firestore();

const { db } = require("../application/lib");

exports.setTeam = function(orgDomain, teamName, teamDescription, teamManagerEmail, teamMembers, taskLabels, statusLabels, priorityLabels, difficultyLabels, orgId, teamId) {
    const setTeam = db.collection("Organizations").doc(orgDomain).collection("Teams").doc(teamName).set({
        TeamName: teamName,
        TeamDescription: teamDescription,
        TeamManagerEmail: teamManagerEmail,
        TeamMembers: teamMembers,
        TaskLabels: taskLabels,
        StatusLabels: statusLabels,
        PriorityLabels: priorityLabels,
        DifficultyLabels: difficultyLabels,
        TotalTeamTasks: 0,
        OrganizationId: orgId,
        TeamId: teamId,
        CurrentSprintId: 0,
    });
    return Promise.resolve(setTeam);
};

exports.updateTeamDetails = function(inputJson, orgDomain, teamName) {
    const updateTeam = db.collection("Organizations").doc(orgDomain).collection("Teams").doc(teamName).update(inputJson);
    return Promise.resolve(updateTeam);
};

exports.getTeam = function(orgDomain, teamName) {
    const getTeamPromise = db.collection("Organizations").doc(orgDomain).collection("Teams").doc(teamName).get().then((doc) => {
        if (doc.exists) return doc.data();
        else return;
    });
    return Promise.resolve(getTeamPromise);
};

exports.getTeamUseTeamId = function(orgDomain, teamId) {
    const getTeamPromise = db.collection("Organizations").doc(orgDomain).collection("Teams").where("TeamId", "==", teamId).get().then((doc) => {
        let data;
        doc.forEach((team) => {
            data = team.data();
        });
        return data;
    });
    return Promise.resolve(getTeamPromise);
};