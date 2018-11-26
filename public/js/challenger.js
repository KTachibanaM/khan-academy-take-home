var work = require('webworkify');

function Challenger (forceSocketIo) {
    if (forceSocketIo === undefined || forceSocketIo === null) {
        forceSocketIo = false;
    }
    this.useSocketIo = forceSocketIo || (window.bowser.msie !== undefined && window.bowser.version <= 9);
    console.log('Challenger: using ' + (this.useSocketIo ? 'socket.io' : 'Web Worker'));

    if (this.useSocketIo) {
        this.socket = io();
    } else {
        this.worker = work(require('./challenge-worker.js'));
    }
}

Challenger.prototype.listen = function (listener) {
    if (this.useSocketIo) {
        this.socket.on('feedback', function (data) {
            listener(data);
        })
    } else {
        this.worker.addEventListener('message', function (e) {
            listener(e.data);
        });
    }
};

Challenger.prototype.send = function (code, criteria) {
    if (this.useSocketIo) {
        this.socket.emit('challenge', {
            'code': code,
            'criteria': criteria
        })
    } else {
        this.worker.postMessage({
            'code': code,
            'criteria': criteria
        });
    }
};

module.exports = Challenger;