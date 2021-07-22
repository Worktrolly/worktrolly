/* eslint-disable object-curly-spacing */
/* eslint-disable no-undef */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
// eslint-disable-next-line no-dupe-else-if

const { updateUser } = require("./lib");

exports.updateUser = function(request, response) {
    const uid = request.body.data.Uid;
    const displayName = request.body.data.DisplayName;
    const aboutMe = request.body.data.AboutMe;
    const phoneNumber = request.body.data.PhoneNumber;
    const linkedInProfile = request.body.data.LinkedInProfile;
    const githubProfile = request.body.data.GithubProfile;
    let result;

    updateUserInputJson = {
        displayName: displayName,
        AboutMe: aboutMe,
        phoneNumber: phoneNumber,
        LinkedInProfile: linkedInProfile,
        GithubProfile: githubProfile,
    };
    updateUser(updateUserInputJson, uid).then(() => {
        result = { data: "User Profile updated successfully" };
        console.log("Successful");
        return response.status(200).send(result);
    }).catch((error) => {
        result = { data: error };
        console.error("Error", error);
        return response.status(500).send(result);
    });
};