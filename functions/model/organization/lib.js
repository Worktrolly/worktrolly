/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
// const admin = require("firebase-admin");
// const db = admin.firestore();

const { db } = require("../application/lib");

exports.setOrg = function(orgDomain, orgId, appKey, securityPhrase, orgName, orgEmail, orgDescription, orgLogoURL) {
    const orgData = db.collection("Organizations").doc(orgDomain).set({
        OrganizationId: orgId,
        AppKey: appKey,
        SecurityPhase: securityPhrase,
        OrganizationName: orgName,
        OrganizationDomain: orgDomain,
        OrganizationEmail: orgEmail,
        OrganizationDescription: orgDescription,
        OrganizationLogoURL: orgLogoURL,
        TeamsId: [],
    });
    return Promise.resolve(orgData);
};

exports.updateOrg = function(orgDomain, inputJson) {
    const updateTeam = db.collection("Organizations").doc(orgDomain).update(inputJson);
    return Promise.resolve(updateTeam);
};

exports.getOrg = function(orgDomain) {
    const getOrgPromise = db.collection("Organizations").doc(orgDomain).get().then((doc) => {
        if (doc.exists) return doc.data();
        else return;
    });
    return Promise.resolve(getOrgPromise);
};

exports.getOrgUseAppKey = function(appKey) {
    const getOrgPromise = db.collection("Organizations").where("AppKey", "==", appKey).get().then((doc) => {
        let data;
        doc.forEach((org) => {
            data = org.data();
        });
        return data;
    });
    return Promise.resolve(getOrgPromise);
};