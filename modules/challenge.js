var acorn = require('acorn');
var walk = require('acorn/dist/walk');

String.prototype.deCapitalize = function () {
    return this.replace(/([A-Z])/g, " $1").toLowerCase();
};

function challenge(code, criteria) {
    try {
        var tree = acorn.parse(code);

        // Process white-list
        var whiteListResults = criteria.whiteList.map(function (wl) {
            return {
                'criterion': wl.deCapitalize(),
                'result': walk.findNodeAt(tree, null, null, wl) !== undefined
            }
        });

        // Process black-list
        var blackListResults = criteria.blackList.map(function (bl) {
            return {
                'criterion': bl.deCapitalize(),
                'result': walk.findNodeAt(tree, null, null, bl) === undefined
            }
        });

        // Process structure
        var structureResults = criteria.structure.map(function (s) {
            // todo: assume structure only has two levels
            var container = s[0];
            var containee = s[1];
            var criterion = container.deCapitalize() + ' with ' + containee.deCapitalize() + ' inside it';
            var containerFound = walk.findNodeAt(tree, null, null, container);
            if (containerFound === undefined) {
                return {
                    'criterion': criterion,
                    'result': false
                }
            } else {
                return {
                    'criterion': criterion,
                    'result': walk.findNodeAt(containerFound.node, null, null, containee)
                }
            }
        });

        return {
            'whiteList': whiteListResults,
            'blackList': blackListResults,
            'structure': structureResults
        }
    } catch (e) {
        if (e instanceof SyntaxError && e.pos) {
            return {
                'error': e.toString()
            }
        } else {
            throw e;
        }
    }
}

module.exports = challenge;