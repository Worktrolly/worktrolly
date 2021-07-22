/* eslint-disable object-curly-spacing */
/* eslint-disable no-undef */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
// eslint-disable-next-line no-dupe-else-if

const { getOrg } = require("../organization/lib");
const { getTeam } = require("../teams/lib");
const { getUserUseEmail, updateUser } = require("./lib");

exports.verifyUser = function(request, response) {
    const organizationDomain = request.body.data.OrganizationDomain;
    const teamId = request.body.data.TeamId;
    const teamName = request.body.data.TeamName;
    const userEmail = request.body.data.UserEmail;
    let appKey = "";
    let organizationId = "";
    let userID = "";
    let status = 200;

    getTeam(organizationDomain, teamName).then((teamDoc) => {
        const teamMembers = teamDoc.TeamMembers;
        if (teamMembers.indexOf(userEmail) != -1) {
            getOrg(organizationDomain).then((orgDoc) => {
                organizationId = orgDoc.OrganizationId;
                appKey = orgDoc.AppKey;
                const p11 = getUserUseEmail(userEmail).then((userDoc) => {
                    userID = userDoc.uid;
                    updateUserInputJson = {
                        OrganizationId: organizationId,
                        TeamId: teamId,
                        AppKey: appKey,
                    };
                    updateUser(updateUserInputJson, userID);
                }).catch((error) => {
                    status = 500;
                    console.log("Error:", error);
                });
                return Promise.resolve(p11);
            });
            const result = { data: "User Verified Successfully" };
            console.log("User Verified Successfully");
            return response.status(status).send(result);
        } else {
            const result = { data: "Can't verify user" };
            console.log("Can't verify user");
            return response.status(status).send(result);
        }
    }).catch((error) => {
        const result = { data: error };
        console.error("Error ", error);
        return response.status(status).send(result);
    });
};