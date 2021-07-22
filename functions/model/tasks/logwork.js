/* eslint-disable require-jsdoc */
/* eslint-disable object-curly-spacing */
// /* eslint-disable no-undef */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
// eslint-disable-next-line no-dupe-else-if

// const { db } = require("../application/lib");
const { addActivity } = require("../activity/addActivity");
const { getOrgUseAppKey } = require("../organization/lib");
const { getOrgRawData, updateOrgRawData } = require("../orgRawData/lib");
const { getSprint, updateSprint } = require("../sprints/lib");
const { getTask, updateTask } = require("./lib");

exports.logWork = function(request, response) {
    const appKey = request.body.data.AppKey;
    const logStatus = request.body.data.LogWorkStatus;
    const taskId = request.body.data.LogTaskId;
    const logHours = parseInt(request.body.data.LogHours);
    const workDone = parseInt(request.body.data.LogWorkDone);
    const sprintNumber = parseInt(request.body.data.SprintNumber);
    const logWorkComment = request.body.data.LogWorkComment;
    const date = request.body.data.Date;
    const time = request.body.data.Time;
    const fullSprintName = createSprintName(sprintNumber);
    let logWorkTotalTime;
    let completiondate = "Not yet Completed";
    const today = new Date();
    const promises = [];
    let status = 200;
    let result;

    const logWorkPromise = getOrgUseAppKey(appKey).then((orgDetails) => {
        const orgDomain = orgDetails.OrganizationDomain;

        const promise1 = getTask(taskId, orgDomain).then((taskDoc) => {
            logWorkTotalTime = parseInt(taskDoc.LogWorkTotalTime);
            logWorkTotalTime = parseInt(logWorkTotalTime) + parseInt(logHours);

            if (logStatus === "Completed") {
                const dd = String(today.getDate()).padStart(2, "0");
                const mm = String(today.getMonth() + 1).padStart(2, "0");
                const yyyy = today.getFullYear();

                const todayDate = dd + "/" + mm + "/" + yyyy;

                completiondate = todayDate;
            }

            const logWorkInputJson = {
                LogWorkTotalTime: logWorkTotalTime,
                WorkDone: workDone,
                Status: logStatus,
                CompletionDate: completiondate,
            };
            updateTask(logWorkInputJson, orgDomain, taskId);
        }).catch((error) => {
            status = 500;
            console.log("Error:", error);
        });
        promises.push(promise1);

        if (logStatus == "Completed") {
            const promise2 = getOrgRawData(orgDomain).then((rawData) => {
                let totalCompletedTask = parseInt(rawData.TotalCompletedTask);
                let totalUnCompletedTask = parseInt(rawData.TotalUnCompletedTask);
                totalCompletedTask += 1;
                totalUnCompletedTask -= 1;

                const updateRawDataInputJson = {
                    TotalCompletedTask: totalCompletedTask,
                    TotalUnCompletedTask: totalUnCompletedTask,
                };
                updateOrgRawData(updateRawDataInputJson, orgDomain);
            }).catch((error) => {
                status = 500;
                console.log("Error:", error);
            });
            promises.push(promise2);

            const promise3 = getTask(taskId, orgDomain).then((taskDoc) => {
                const project = taskDoc.Project;

                const sprintCounterUpdate = getSprint(orgDomain, project, fullSprintName).then((sprintDetails) => {
                    let totalUnCompletedTask = sprintDetails.TotalUnCompletedTask;
                    let totalCompletedTask = sprintDetails.TotalCompletedTask;

                    totalUnCompletedTask -= 1;
                    totalCompletedTask += 1;

                    const updateSprintInputJson = {
                        TotalCompletedTask: totalCompletedTask,
                        TotalUnCompletedTask: totalUnCompletedTask,
                    };
                    updateSprint(updateSprintInputJson, orgDomain, project, fullSprintName);
                });
                return Promise.resolve(sprintCounterUpdate);
            }).catch((error) => {
                status = 500;
                console.log("Error:", error);
            });
            promises.push(promise3);
        }

        addActivity("LOGWORK_COMMENT", logWorkComment, taskId, date, time, orgDomain);
        Promise.resolve(promises).then(() => {
                result = { data: "Logged Work successfully!" };
                console.log("Logged Work successfully!");
                return response.status(status).send(result);
            })
            .catch((error) => {
                const result = { data: error };
                console.error("Error Logging Work", error);
                return response.status(status).send(result);
            });
    });
    return Promise.resolve(logWorkPromise);
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