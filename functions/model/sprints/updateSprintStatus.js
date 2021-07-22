/* eslint-disable require-jsdoc */
/* eslint-disable  object-curly-spacing*/
// /* eslint-disable no-undef */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
// eslint-disable-next-line no-dupe-else-if

const { getOrgUseAppKey } = require("../organization/lib");
const { getTeamUseTeamId } = require("../teams/lib");
const { updateSprint } = require("./lib");


exports.updateSprintStatus = function(request, response) {
    const sprintStatus = request.body.data.SprintStatus;
    const currentSprintName = request.body.data.CurrentSprintName;
    const appKey = request.body.data.AppKey;
    const teamId = request.body.data.TeamId;
    let orgDomain;
    console.log(currentSprintName);
    let result;
    let status = 200;

    const updateSprintPromise = getOrgUseAppKey(appKey).then((orgDoc) => {
        orgDomain = orgDoc.OrganizationDomain;

        const updateTeamSprintStatus = getTeamUseTeamId(orgDomain, teamId).then((teamDoc) => {
            const teamName = teamDoc.TeamName;

            const updateSprintStatusInputJson = {
                Status: sprintStatus,
            };
            updateSprint(updateSprintStatusInputJson, orgDomain, teamName, currentSprintName);
        }).catch((error) => {
            status = 500;
            console.log("Error:", error);
        });
        console.log("Sprint updated successfully");
        result = { data: "OK" };
        return Promise.resolve(updateTeamSprintStatus);
    });
    return Promise.resolve(updateSprintPromise).then(() => {
        result = { data: "Sprint Updated Successfully" };
        console.log("Sprint Updated Successfully");
        return response.status(status).send(result);
    }).catch((error) => {
        result = { data: error };
        console.error("Error Updating Sprint", error);
        return response.status(status).send(result);
    });
};