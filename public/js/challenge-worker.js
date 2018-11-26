var challenge = require('../../modules/challenge');

module.exports = function (self) {
    self.addEventListener('message', function (e) {
        var feedback = challenge(e.data.code, e.data.criteria);
        self.postMessage(feedback);
    })
};