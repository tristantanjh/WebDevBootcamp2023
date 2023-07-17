// exports.getDate allows for multiple functions to be exported. eg: exports.getMonth = another function

exports.getDate = () => {
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    return today.toLocaleDateString("en-UK", options);
};