/* eslint-disable require-jsdoc */
/* eslint-disable  object-curly-spacing*/
// /* eslint-disable no-undef */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
// eslint-disable-next-line no-dupe-else-if

const { addActivity } = require("../activity/addActivity");
const { getOrgUseAppKey } = require("../organization/lib");
const { getSprint, updateSprint, setSprint } = require("../sprints/lib");
const { updateTask, getTask } = require("./lib");

exports.deleteTask = function(request, response) {
    const appKey = request.body.data.AppKey;
    const sprintNumber = request.body.data.SprintNumber;
    const taskId = request.body.data.Id;
    const fullSprintId = createSprintName(sprintNumber);
    const taskStatus = request.body.data.Status;
    let result;
    const date = request.body.data.Date;
    const time = request.body.data.Time;
    let status = 200;

    const deleteTaskPromise = getOrgUseAppKey(appKey).then((orgDoc) => {
        const orgDomain = orgDoc.OrganizationDomain;
        const orgId = orgDoc.OrganizationId;

        const updateTaskInputJson = {
            SprintNumber: -2,
        };
        updateTask(updateTaskInputJson, orgDomain, taskId);

        const updateSprints = getTask(taskId, orgDomain).then((taskDoc) => {
            const teamName = taskDoc.Project;
            const teamId = teamName.slice(0, 3);

            const p1 = getSprint(orgDomain, teamName, fullSprintId).then((sprintDoc) => {
                if (sprintDoc != undefined) {
                    let totalCompletedTask = sprintDoc.TotalCompletedTask;
                    let totalUnCompletedTask = sprintDoc.TotalUnCompletedTask;
                    let totalNumberOfTask = sprintDoc.TotalNumberOfTask;

                    totalNumberOfTask = totalNumberOfTask - 1;
                    // status === "Completed" ? totalCompletedTask = totalCompletedTask - 1 : totalUnCompletedTask = totalUnCompletedTask - 1;
                    if (taskStatus === "Completed") {
                        totalCompletedTask = totalCompletedTask - 1;
                    } else {
                        totalUnCompletedTask = totalUnCompletedTask - 1;
                    }

                    const updatesprintInputJson = {
                        TotalCompletedTask: totalCompletedTask,
                        TotalNumberOfTask: totalNumberOfTask,
                        TotalUnCompletedTask: totalUnCompletedTask,
                    };
                    updateSprint(updatesprintInputJson, orgDomain, teamName, fullSprintId);
                }
            }).catch((error) => {
                status = 500;
                console.log("Error:", error);
            });
            // return Promise.resolve(p1);

            const p2 = getSprint(orgDomain, teamName, "Deleted").then((sprintDoc) => {
                if (sprintDoc != undefined) {
                    const totalNumberOfTask = sprintDoc.TotalNumberOfTask + 1;

                    const updateDeletedSprintJson = {
                        TotalNumberOfTask: totalNumberOfTask,
                    };

                    updateSprint(updateDeletedSprintJson, orgDomain, teamName, "Deleted");
                } else {
                    setSprint(orgDomain, teamName, "Deleted", orgId, teamId, "-2", "-", 1);
                }
            }).catch((error) => {
                status = 500;
                console.log("Error:", error);
            });

            addActivity("DELETED", "Deleted Task", taskId, date, time, orgDomain);

            const promises = [p1, p2];
            Promise.all(promises).then(() => {
                    result = { data: "OK" };
                    console.log("Deleted Task Sucessfully");
                    return response.status(status).send(result);
                })
                .catch((error) => {
                    result = { data: error };
                    console.error("Error Deleting Task", error);
                    return response.status(status).send(result);
                });
        });
        return Promise.resolve(updateSprints);
    });
    return Promise.resolve(deleteTaskPromise);
};

function createSprintName(sprintId) {
    if (sprintId == -1) {
        return "Backlog";
    } else if (sprintId == -2) {
        return "Deleted";
    } else {
        return ("S" + sprintId.toString());
    }
}