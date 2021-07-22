/* eslint-disable  object-curly-spacing*/
// /* eslint-disable no-undef */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
// eslint-disable-next-line no-dupe-else-if

const admin = require("firebase-admin");
const { setTeam, getTeam, updateTeamDetails } = require("./lib");
// const { updateTeam } = require("./updateTeam");
const { getOrg, updateOrg } = require("../organization/lib");
const { setSprint } = require("../sprints/lib");


exports.createTeam = function(request, response) {
    const teamId = request.body.data.TeamId;
    const teamDescription = request.body.data.TeamDescription;
    const teamManagerEmail = request.body.data.TeamManagerEmail;
    const teamMembers = request.body.data.TeamMembers;
    const taskLabels = request.body.data.TaskLabels;
    const statusLabels = request.body.data.StatusLabels;
    const priorityLabels = request.body.data.PriorityLabels;
    const difficultyLabels = request.body.data.DifficultyLabels;

    const orgDomain = request.body.data.OrganizationDomain;
    const teamName = request.body.data.TeamName;
    let orgId;

    let status = 200;

    const promise1 = getOrg(orgDomain).then((orgDoc) => {
        if (orgDoc != undefined) {
            orgId = orgDoc.OrganizationId;
            console.log(orgId);

            const inputJson = {
                TeamsId: admin.firestore.FieldValue.arrayUnion(teamId),
            };
            updateOrg(orgDomain, inputJson);
        }

        const promise2 = getTeam(orgDomain, teamName).then((team) => {
            if (team == undefined) {
                console.log(orgId);

                setTeam(orgDomain, teamName, teamDescription, teamManagerEmail, teamMembers, taskLabels, statusLabels, priorityLabels, difficultyLabels, orgId, teamId);
            } else {
                const inputJson = {
                    TeamDescription: teamDescription,
                    TeamManagerEmail: teamManagerEmail,
                    TeamMembers: teamMembers,
                    TaskLabels: taskLabels,
                    StatusLabels: statusLabels,
                    PriorityLabels: priorityLabels,
                    DifficultyLabels: difficultyLabels,
                };
                updateTeamDetails(inputJson, orgDomain, teamName);
            }
        }).catch((error) => {
            status = 500;
            console.log("Error:", error);
        });
        return Promise.resolve(promise2);
    }).catch((error) => {
        status = 500;
        console.log("Error:", error);
    });

    const promise2 = getOrg(orgDomain).then((orgDoc) => {
        orgId = orgDoc.OrganizationId;
        setSprint(orgDomain, teamName, "Deleted", orgId, teamId, -2, "-");

        setSprint(orgDomain, teamName, "Backlog", orgId, teamId, -1, "-");
    }).catch((error) => {
        status = 500;
        console.log("Error:", error);
    });

    const Promises = [promise1, promise2];
    let result;
    return Promise.all(Promises).then(() => {
            result = { data: "Team Created Successfully" };
            console.log("Team Created Successfully");
            return response.status(status).send(result);
        })
        .catch((error) => {
            result = { data: error };
            console.error("Error Creating Team", error);
            return response.status(status).send(result);
        });
};