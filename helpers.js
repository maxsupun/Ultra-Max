function successfullMessage(msg) {
    return "✅ *UltraMax*:  ```" + msg + "```"
}
function errorMessage(msg) {
    return "🛑 *UltraMax*:  ```" + msg + "```"
}
function infoMessage(msg) {
    return "• *UltraMax :*  ```" + msg + "```"
}


module.exports = {
    successfullMessage,
    errorMessage,
    infoMessage
}
