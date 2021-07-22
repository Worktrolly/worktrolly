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
const { getSprint, updateSprint, setSprint } = require("../sprints/lib");
const { getTask, updateTask } = require("./lib");

exports.editTask = function(request, response) {
    const appKey = request.body.data.AppKey;
    const description = request.body.data.Description;
    const priority = request.body.data.Priority;
    const difficulty = request.body.data.Difficulty;
    const assignee = request.body.data.Assignee;
    const estimatedTime = request.body.data.EstimatedTime;
    const storyPointNumber = request.body.data.StoryPointNumber;
    const editedSprintNumber = request.body.data.SprintNumber;
    const previousId = request.body.data.PreviousId;
    const creationDate = request.body.data.CreationDate;
    const changedData = request.body.data.ChangedData;
    const previousSprintName = createSprintName(previousId);
    const taskId = request.body.data.Id;
    const editedSprintName = createSprintName(editedSprintNumber);
    let result;
    let status = 200;
    const date = request.body.data.Date;
    const time = request.body.data.Time;
    let comment = "Edited task details: ";

    const promises = [];

    const editTaskPromise = getOrgUseAppKey(appKey).then((orgDetail) => {
        const orgDomain = orgDetail.OrganizationDomain;
        const orgId = orgDetail.OrganizationId;

        if (editedSprintNumber != previousId) {
            comment += "Moved to sprint " + editedSprintName + ". ";

            const p1 = getTask(taskId, orgDomain).then((taskDoc) => {
                const project = taskDoc.Project;

                const prevSprintPromise = getSprint(orgDomain, project, previousSprintName).then((prevSprint) => {
                    if (prevSprint != undefined) {
                        let totalUnCompletedTask = prevSprint.TotalUnCompletedTask;
                        let totalNumberOfTask = prevSprint.TotalNumberOfTask;

                        totalUnCompletedTask -= 1;
                        totalNumberOfTask -= 1;

                        const updatePrevSprintJson = {
                            TotalNumberOfTask: totalNumberOfTask,
                            TotalUnCompletedTask: totalUnCompletedTask,
                        };

                        updateSprint(updatePrevSprintJson, orgDomain, project, previousSprintName);
                    }
                });
                return Promise.resolve(prevSprintPromise);
            }).catch((error) => {
                status = 500;
                console.log("Error:", error);
            });
            promises.push(p1);

            const p2 = getTask(taskId, orgDomain).then((taskDoc) => {
                const project = taskDoc.Project;
                const teamId = taskDoc.TeamId;

                const newSprintPromise = getSprint(orgDomain, project, editedSprintName).then((newSprint) => {
                    if (newSprint != undefined) {
                        let totalUnCompletedTask = newSprint.TotalUnCompletedTask;
                        let totalNumberOfTask = newSprint.TotalNumberOfTask;

                        totalUnCompletedTask += 1;
                        totalNumberOfTask += 1;

                        const updateNewSprintJson = {
                            TotalNumberOfTask: totalNumberOfTask,
                            TotalUnCompletedTask: totalUnCompletedTask,
                        };
                        updateSprint(updateNewSprintJson, orgDomain, project, editedSprintName);
                    } else {
                        setSprint(orgDomain, project, editedSprintName, orgId, teamId, editedSprintNumber, "Not Started", 1, 1);
                    }
                });
                return Promise.resolve(newSprintPromise);
            }).catch((error) => {
                status = 500;
                console.log("Error:", error);
            });
            promises.push(p2);
        }

        const updateTaskJson = {
            Description: description,
            CreationDate: creationDate,
            Priority: priority,
            Difficulty: difficulty,
            Assignee: assignee,
            EstimatedTime: estimatedTime,
            SprintNumber: editedSprintNumber,
            StoryPointNumber: storyPointNumber,
        };
        updateTask(updateTaskJson, orgDomain, taskId);

        comment = comment + changedData;
        console.log(comment);
        addActivity("EDITED", comment, taskId, date, time, orgDomain);

        Promise.all(promises).then(() => {
                result = { data: "OK" };
                console.log("Edited Task Successfully");
                return response.status(status).send(result);
            })
            .catch((error) => {
                result = { data: error };
                console.error("Error Editing Task", error);
                return response.status(status).send(result);
            });
    });
    Promise.resolve(editTaskPromise);
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