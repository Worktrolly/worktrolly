// /* eslint-disable object-curly-spacing */
// /* eslint-disable no-undef */
/* eslint-disable eol-last */
// /* eslint-disable indent */
// /* eslint-disable max-len */
// // eslint-disable-next-line no-dupe-else-if

// const { updateTeamDetails, getTeam } = require("./lib");
// const { createTeam } = require("./createTeam");

// // const { db } = require("../application/lib");

// exports.updateTeam = function(request, response) {
//     const teamDescription = request.body.data.TeamDescription;
//     const teamManagerEmail = request.body.data.TeamManagerEmail;
//     const teamMembers = request.body.data.TeamMembers;
//     const taskLabels = request.body.data.TaskLabels;
//     const statusLabels = request.body.data.StatusLabels;
//     const priorityLabels = request.body.data.PriorityLabels;
//     const difficultyLabels = request.body.data.DifficultyLabels;

//     const orgDomain = request.body.data.OrganizationDomain;
//     const teamName = request.body.data.TeamName;

//     let status = 200;

//     const promise1 = getTeam(orgDomain, teamName).then((team) => {
//         if (team.exist) {
//             const updateJson = {
//                 TeamDescription: teamDescription,
//                 TeamManagerEmail: teamManagerEmail,
//                 TeamMembers: teamMembers,
//                 TaskLabels: taskLabels,
//                 StatusLabels: statusLabels,
//                 PriorityLabels: priorityLabels,
//                 DifficultyLabels: difficultyLabels,
//             };
//             updateTeamDetails(updateJson);
//         } else {
//             createTeam(request, response);
//         }
//     }).catch((error) => {
//         status = 500;
//         console.log("Error: ", error);
//     });

//     const Promises = [promise1];
//     let result;
//     return Promise.all(Promises).then(() => {
//             result = { data: "Team Created Successfully" };
//             console.log("Team Created Successfully");
//             return response.status(status).send(result);
//         })
//         .catch((error) => {
//             result = { data: error };
//             console.error("Error Creating Team", error);
//             return response.status(status).send(result);
//         });
// };