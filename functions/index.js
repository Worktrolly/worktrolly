/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable object-curly-spacing */
/* eslint-disable require-jsdoc */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
// eslint-disable-next-line no-dupe-else-if

const admin = require("firebase-admin");
admin.initializeApp();


// const createNewTaskAPI = require("./createNewTaskAPI");
// const startNewSprintAPI = require("./startNewSprintAPI");
// const logWorkAPI = require("./logWorkAPI");
// const editPageTaskAPI = require("./editPageTaskAPI");
// const deleteTaskAPI = require("./deleteTaskAPI");
// const createNewUserAPI = require("./createNewUserAPI");
const { users } = require("./model/users/users");
const { tasks } = require("./model/tasks/tasks");
const { organization } = require("./model/organization/organization");
const { teams } = require("./model/teams/teams");
const { sprints } = require("./model/sprints/sprints");
const { patch } = require("./model/patch/patch");
// const updateSprintStatusAPI = require("./updateSprintStatusAPI");
// const createNewOrgAPI = require("./createNewOrgAPI");
// const patch1API = require("./patch1API");
// const verifyUserAPI = require("./verifyUserAPI");
// const updateUserProfileAPI = require("./updateUserProfileAPI");
// const updateThemeAPI = require("./updateUserProfileAPI");
// const patch1API = require("./patch1API");
// const patch2API = require("./patch2API");
// const patch3API = require("./patch3API");


// class Task {
//     constructor(id, title, status, priority, estimatedTime, difficulty, description, creator, project , assignee, logWorkTotalTime, workDone, creationDate, sprintNumber, storyPointNumber) {
//         this.Id = id;
//         this.Title = title;
//         this.Status = status;
//         this.Priority = priority;
//         this.EstimatedTime = estimatedTime;
//         this.Difficulty = difficulty;
//         this.Description = description;
//         this.Creator = creator;
//         this.Project = project;
//         this.Assignee = assignee;
//         this.LogWorkTotalTime = logWorkTotalTime;
//         this.WorkDone = workDone;
//         this.CreationDate = creationDate;
//         this.SprintNumber = sprintNumber;
//         this.StoryPointNumber = storyPointNumber;
//     }
// }

// exports.createNewTask = createNewTaskAPI.createNewTask;
// exports.startNewSprint = startNewSprintAPI.startNewSprint;
// exports.logWork = logWorkAPI.logWork;
// exports.editPageTask = editPageTaskAPI.editPageTask;
// exports.deleteTask = deleteTaskAPI.deleteTask;
exports.users = users;
exports.tasks = tasks;
exports.organization = organization;
exports.teams = teams;
exports.sprints = sprints;
exports.patch = patch;
// exports.updateSprintStatus = updateSprintStatusAPI.updateSprintStatus;
// exports.createNewOrganization = createNewOrgAPI.createNewOrganization;
// exports.createNewTeamWithLabels = createNewOrgAPI.createNewTeamWithLabels;
// exports.patch1 = patch1API.patch1;
// exports.verifyUser = verifyUserAPI.verifyUser;
// exports.updateUserProfile = updateUserProfileAPI.updateUserProfile;
// exports.updateTheme = updateThemeAPI.updateTheme;
// exports.patch1 = patch1API.patch1;
// exports.patch2 = patch2API.patch2;
// exports.patch3 = patch3API.patch3;