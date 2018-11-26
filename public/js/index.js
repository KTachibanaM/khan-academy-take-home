var Challenger = require('./challenger');

var CRITERIA = {
    'whiteList': ['ForStatement', 'VariableDeclaration'],
    'blackList': ['WhileStatement', 'IfStatement'],
    'structure': [['ForStatement', 'IfStatement']]
};

$(document).ready(function () {
    var editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
        lineNumbers: true,
        mode: 'javascript'
    });

    function renderFeedback(feedback) {
        var list = $('#feedback');
        var error = $('#error');
        var checkMark = '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>';
        var crossMark = '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>';
        function whichMark(boolean) {
            return boolean ? checkMark : crossMark;
        }
        if (feedback.error) {
            error.show();
            error.text(feedback.error);
        } else {
            list.show();
            error.hide();
            list.empty();
            feedback.whiteList.forEach(function (wl) {
                var li = $('<li>' + whichMark(wl.result) + 'Must have ' + wl.criterion + '</li>');
                list.append(li);
            });
            feedback.blackList.forEach(function (bl) {
                var li = $('<li>' + whichMark(bl.result) + 'Must NOT have ' + bl.criterion + '</li>');
                list.append(li);
            });
            feedback.structure.forEach(function (s) {
                var li = $('<li>' + whichMark(s.result) + 'Must have ' + s.criterion + '</li>');
                list.append(li);
            });
        }
    }

    var challenger = new Challenger();

    challenger.listen(function (feedback) {
        renderFeedback(feedback);
    });

    editor.on('change', function (mirror) {
        challenger.send(mirror.getValue(), CRITERIA);
    });

    challenger.send(editor.getValue(), CRITERIA);
});
