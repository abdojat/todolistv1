
exports.getDate = ()=> {
    const today = new Date();
    const option = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };
    const day = today.toLocaleDateString("en-US", option);
    return day;
}
exports.getDay = ()=> {
    const today = new Date();
    const option = {
        weekday: 'long',
    };
    const day = today.toLocaleDateString("en-US", option);
    return day;
}