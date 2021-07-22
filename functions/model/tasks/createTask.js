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
const { getSprint, updateSprint, setSprint } = require("../sprints/lib");
const { updateTeamDetails, getTeam } = require("../teams/lib");
const { setTask } = require("./lib");

exports.createNewTask = function(request, response) {
    const appKey = request.body.data.AppKey;
    const title = request.body.data.Title;
    const des = request.body.data.Description;
    const priority = request.body.data.Priority;
    const difficulty = request.body.data.Difficulty;
    const creator = request.body.data.Creator;
    const assignee = request.body.data.Assignee;
    const estimatedTime = parseInt(request.body.data.EstimatedTime);
    const taskStatus = request.body.data.Status;
    const project = request.body.data.Project;
    const storyPointNumber = parseInt(request.body.data.StoryPointNumber);
    const sprintNumber = parseInt(request.body.data.SprintNumber);
    const creationDate = request.body.data.CreationDate;
    const time = request.body.data.Time;
    const fullSprintName = createSprintName(sprintNumber);
    const loggedWorkTotalTime = 0;
    const workDone = 0;
    let taskId;
    let totalNumberOfTask;
    let result;
    let totalUnCompletedTask;
    const completiondate = "Not yet Completed";
    const teamId = project.slice(0, 3);
    let orgDomain;
    let orgId;
    let status = 200;
    console.log(teamId);

    const promise1 = getOrgUseAppKey(appKey).then((orgDetail) => {
        orgDomain = orgDetail.OrganizationDomain;
        orgId = orgDetail.OrganizationId;

        const promise1 = getTeam(orgDomain, project).then((team) => {
            const totalTeamTasks = team.TotalTeamTasks + 1;
            taskId = teamId.toString() + totalTeamTasks.toString();

            const updateTeamJson = {
                TotalTeamTasks: totalTeamTasks,
            };
            /* const p1 =*/
            updateTeamDetails(updateTeamJson, orgDomain, project);

            /* const p2 =*/
            setTask(orgDomain, taskId, title, des, priority, difficulty, creator, assignee, estimatedTime, taskStatus, project, loggedWorkTotalTime, workDone, sprintNumber, storyPointNumber, creationDate, completiondate, orgId, teamId);

            addActivity("CREATED", "Created task " + taskId, taskId, creationDate, time, orgDomain);
            // const promises1 = [p1, p2];
            // return Promise.all(promises1);
        }).catch((error) => {
            status = 500;
            console.log("Error:", error);
        });

        const promise2 = getSprint(orgDomain, project, fullSprintName).then((sprint) => {
            if (sprint != undefined) {
                totalUnCompletedTask = sprint.TotalUnCompletedTask;
                totalNumberOfTask = sprint.TotalNumberOfTask;

                totalUnCompletedTask = totalUnCompletedTask + 1;
                totalNumberOfTask = totalNumberOfTask + 1;

                const updateSprintJson = {
                    TotalNumberOfTask: totalNumberOfTask,
                    TotalUnCompletedTask: totalUnCompletedTask,
                };
                updateSprint(updateSprintJson, orgDomain, project, fullSprintName);
            } else {
                totalNumberOfTask = 1;
                totalUnCompletedTask = 1;

                setSprint(orgDomain, project, fullSprintName, orgId, teamId, sprintNumber, "Not Started", totalNumberOfTask, totalUnCompletedTask);
            }
        }).catch((error) => {
            status = 500;
            console.log("Error:", error);
        });

        const promise3 = getOrgRawData(orgDomain).then((rawData) => {
            totalNumberOfTask = rawData.TotalNumberOfTask;
            totalUnCompletedTask = rawData.TotalUnCompletedTask;
            totalUnCompletedTask += 1;
            totalNumberOfTask += 1;

            const updateRawDataInputJson = {
                TotalNumberOfTask: totalNumberOfTask,
                TotalUnCompletedTask: totalUnCompletedTask,
            };

            updateOrgRawData(updateRawDataInputJson, orgDomain);
        });

        const promises = [promise1, promise2, promise3];
        return Promise.all(promises).catch((error) => {
            status = 500;
            console.log("Error:", error);
        });
    });
    // const createTaskPromises = [promise1];
    return Promise.resolve(promise1).then(() => {
            result = { data: "Task Created Successfully" };
            console.log("Task Created Successfully");
            return response.status(status).send(result);
        })
        .catch((error) => {
            result = { data: error };
            console.error("Error Creating Task", error);
            return response.status(status).send(result);
        });
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