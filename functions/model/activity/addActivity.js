/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
// eslint-disable-next-line no-dupe-else-if

const { getActivities, updateActivities, setActivities, setAction } = require("./lib");


// let activityPromise;
let actionId;
let totalActions;
let totalComments;

exports.addActivity = function(type, comment, taskId, date, time, orgDomain) {
    const promise1 = getActivities(orgDomain, taskId).then((activityDoc) => {
        if (activityDoc != undefined) {
            totalActions = activityDoc.TotalActions + 1;
            totalComments = activityDoc.TotalComments + 1;

            actionId = createActivityId(totalActions);

            const updateActivitiesInputJson = {
                TotalActions: totalActions,
                TotalComments: totalComments,
            };
            updateActivities(updateActivitiesInputJson, orgDomain, taskId);
        } else {
            totalActions = 1;
            totalComments = 1;
            actionId = createActivityId(totalActions);

            setActivities(orgDomain, taskId);
        }

        setAction(orgDomain, taskId, actionId, type, comment, date, time);
    });
    return Promise.resolve(promise1).then(() => {
            console.log("Activity Tracked successfully!");
            return 0;
        })
        .catch((error) => {
            console.error("Error Tracking Activity: ", error);
        });
};

/**
 * Adds two numbers together.
 * @param {int} actionId The first number.
 * @return {string} The sum of the two numbers.
 */
function createActivityId(actionId) {
    return ("A" + actionId);
}