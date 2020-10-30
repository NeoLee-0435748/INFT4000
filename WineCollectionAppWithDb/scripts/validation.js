//validation checking functions
function submitErrors(wineData) {
    let errors = [];
    const regexYear = /^\d{4}$/;
    const regexRating = /^\d{1}$/;

    //name
    if (!wineData[0]) {
        errors.push({ "nameError": "*Please input a proper wine name" })
    }
    //year
    if (!regexYear.test(wineData[3])) {
        errors.push({ "yearError": "*Please input a correct year format ####" })
    }
    //winary
    if (!wineData[4]) {
        errors.push({ "wineryError": "*Please input a proper winery name" })
    }
    //purchased year
    if (!regexYear.test(wineData[5])) {
        errors.push({ "purchError": "*Please input a correct year format ####" })
    }
    //rating year
    if (!regexRating.test(wineData[6])) {
        errors.push({ "ratingError": "*Please input a correct rating format #" })
    }

    return errors
}

function clearErrors() {
    const errorIDS = ["nameError", "yearError", "wineryError", "purchError", "ratingError"];

    errorIDS.forEach(id => {
        document.getElementById(id).innerHTML = "";
        document.getElementById(id).hidden = true;
    });
}

module.exports = {
    submitErrors: submitErrors,
    clearErrors: clearErrors,
}