/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */

const { db } = require("../application/lib");

exports.setOrgRawData = function(orgDomain) {
    const setOrgAppDetails = db.collection("Organizations").doc(orgDomain).collection("RawData").doc("AppDetails").set({
        CurrentSprintId: 0,
        TotalNumberOfTask: 0,
        TotalCompletedTask: 0,
        TotalUnCompletedTask: 0,
        TotalNumberOfOrganizations: -1,
    });
    return Promise.resolve(setOrgAppDetails);
};

exports.updateOrgRawData = function(inputJson, orgDomain) {
    const updateOrgAppDetails = db.collection("Organizations").doc(orgDomain).collection("RawData").doc("AppDetails").update(inputJson);
    return Promise.resolve(updateOrgAppDetails);
};

exports.getOrgRawData = function(orgDomain) {
    const getOrgAppDetails = db.collection("Organizations").doc(orgDomain).collection("RawData").doc("AppDetails").get().then((doc) => {
        if (doc.exists) {
            return doc.data();
        } else {
            return;
        }
    });
    return Promise.resolve(getOrgAppDetails);
};