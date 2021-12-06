/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./Score.ts":
/*!******************!*\
  !*** ./Score.ts ***!
  \******************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Score = /** @class */ (function () {
    function Score() {
        this.x = 12;
        this.y = 24;
        this.id = "score";
        this.value = 0;
        console.log('score');
    }
    Score.prototype.redraw = function (engine) {
        var ctx = engine.game.canvas.getContext("2d");
        ctx.fillStyle = 'red';
        ctx.font = '14px tahoma';
        ctx.fillText("score [".concat(this.value, "]"), this.x, this.y);
    };
    return Score;
}());
exports["default"] = Score;


/***/ }),

/***/ "./constants.ts":
/*!**********************!*\
  !*** ./constants.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.highlightcolors = exports.grid = void 0;
var rows = 16;
var cols = 13;
exports.grid = Array(rows).fill(Array(cols).fill(0));
exports.highlightcolors = [
    'Violet',
    'Indigo',
    'Blue',
    'Green',
    'Yellow',
    'Orange',
    'Red',
];


/***/ }),

/***/ "./engine.ts":
/*!*******************!*\
  !*** ./engine.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var pieces_1 = __webpack_require__(/*! ./pieces */ "./pieces.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./constants.ts");
var Score_1 = __webpack_require__(/*! ./Score */ "./Score.ts");
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["init"] = 0] = "init";
    GameStatus[GameStatus["pause"] = 1] = "pause";
    GameStatus[GameStatus["play"] = 2] = "play";
    GameStatus[GameStatus["gameOver"] = 3] = "gameOver";
})(GameStatus || (GameStatus = {}));
var GameEngine = /** @class */ (function () {
    function GameEngine(canvasElement) {
        this.pieces = [];
        this.systems = [];
        this.refresh = 400;
        this.refreshHandler = null;
        this.world = [];
        this.score = null;
        this.status = GameStatus.gameOver;
        this.game = {
            canvas: null,
            height: constants_1.grid.length,
            width: constants_1.grid[0].length,
            cellSize: 20,
        };
        console.log('game engine created');
        this.game.canvas = canvasElement;
        this.world = JSON.parse(JSON.stringify(constants_1.grid));
        this.score = new Score_1.default();
        var body = document.getElementsByTagName('body')[0];
        body.addEventListener('click', this.handleScreenClick.bind(this));
    }
    GameEngine.prototype.addSystem = function (system) {
        this.systems.push(system);
    };
    GameEngine.prototype.addPiece = function (piece) {
        this.pieces.push(piece);
    };
    GameEngine.prototype.handleScreenClick = function () {
        if (this.status == GameStatus.gameOver) {
            this.status = GameStatus.play;
        }
        else if (this.status == GameStatus.pause) {
            this.status = GameStatus.play;
        }
        else if (this.status == GameStatus.play) {
            this.status = GameStatus.pause;
        }
    };
    GameEngine.prototype.clearCanvas = function () {
        var ctx = this.game.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.game.width * this.game.cellSize, this.game.height * this.game.cellSize);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.game.width * this.game.cellSize, this.game.height * this.game.cellSize);
        for (var i = 0; i < this.game.width; i += 1) {
            // random colors from highlighcolors
            for (var j = 0; j < this.game.height; j += 1) {
                ctx.fillStyle = constants_1.highlightcolors[Math.floor(Math.random() * constants_1.highlightcolors.length)];
                ctx.fillRect(i * this.game.cellSize, j * this.game.cellSize, 1, 1);
            }
        }
    };
    GameEngine.prototype.update = function () {
        var _this = this;
        this.clearCanvas();
        if (this.status == GameStatus.gameOver) {
            var ctx_1 = this.game.canvas.getContext("2d");
            ctx_1.fillStyle = 'yellow';
            ctx_1.font = '14px tahoma';
            var messages = [
                ' WELCOME',
                '  tap screen'
            ];
            messages.forEach(function (msg, i) {
                ctx_1.fillText(msg, (Math.floor(_this.game.width / 2)) * _this.game.cellSize - msg.length * 2, Math.floor(_this.game.height / 2) * _this.game.cellSize + i * _this.game.cellSize);
            });
        }
        else if (this.status == GameStatus.play) {
            this.pieces.forEach(function (piece) {
                var effectedBy = piece.effectdBySystems || [];
                effectedBy.forEach(function (systemName) {
                    var system = _this.systems.find(function (s) { return s.name === systemName; });
                    if (system) {
                        system.effects.bind(_this)(piece);
                    }
                });
                piece.redraw(_this);
            });
            this.score.redraw(this);
        }
        else if (this.status == GameStatus.pause) {
            this.pieces.forEach(function (piece) {
                piece.redraw(_this);
            });
            this.score.redraw(this);
        }
    };
    GameEngine.prototype.createRandomPiece = function () {
        var piecesNames = Object.keys(pieces_1.default);
        var randomPieceName = piecesNames[Math.floor(Math.random() * piecesNames.length)];
        var x = Math.floor(this.game.width / 2) - 1;
        console.log('randomPieceName', randomPieceName);
        var randomPiece = pieces_1.default[randomPieceName];
        var randomPieceInstance = new randomPiece();
        randomPieceInstance.effectdBySystems = ['gravity', 'fixIt', 'addNewPiece', 'restartTheGame', 'keyboard'];
        randomPieceInstance.x = x;
        randomPieceInstance.y = 0;
        // add random string id
        randomPieceInstance.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return randomPieceInstance;
    };
    GameEngine.prototype.start = function () {
        console.log('game started');
        this.refreshHandler = setInterval(this.update.bind(this), this.refresh);
    };
    return GameEngine;
}());
exports["default"] = GameEngine;


/***/ }),

/***/ "./events.ts":
/*!*******************!*\
  !*** ./events.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.listenEvents = void 0;
var listenEvents = function (btnLeft, btnRight, btnFlip) {
    var left = document.getElementById('btn-left');
    left.addEventListener('click', function (e) {
        e.stopPropagation();
        btnLeft(e);
    });
    var right = document.getElementById('btn-right');
    right.addEventListener('click', function (e) {
        e.stopPropagation();
        btnRight(e);
    });
    var flip = document.getElementById('btn-flip');
    flip.addEventListener('click', function (e) {
        e.stopPropagation();
        btnFlip(e);
    });
};
exports.listenEvents = listenEvents;


/***/ }),

/***/ "./intersection.ts":
/*!*************************!*\
  !*** ./intersection.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (function (piece, world) {
    var hitPiece = function (x, y) {
        return piece.template().some(function (row, j) {
            return row.some(function (c, i) {
                return c === 1 && piece.x + i === x && piece.y + j === y;
            });
        });
    };
    return world.some(function (row, y) {
        return row.some(function (cell, x) {
            return cell !== 0 && hitPiece(x, y);
        });
    });
});


/***/ }),

/***/ "./pieces.ts":
/*!*******************!*\
  !*** ./pieces.ts ***!
  \*******************/
/***/ (function(__unused_webpack_module, exports) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Piece = /** @class */ (function () {
    function Piece() {
        this.x = 0;
        this.y = 0;
        this.id = '';
        this.status = 0;
        this.rotate = 0;
        this.color = 'red';
    }
    Object.defineProperty(Piece.prototype, "height", {
        get: function () {
            return this.template().length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Piece.prototype, "width", {
        get: function () {
            return this.template()[0].length;
        },
        enumerable: false,
        configurable: true
    });
    Piece.prototype.moveLeft = function (engine) {
        if (engine.canMove(-1, 0)) {
            this.x--;
        }
    };
    Piece.prototype.redraw = function (engine) {
        var _this = this;
        var ctx = engine.game.canvas.getContext("2d");
        ctx.fillStyle = this.color;
        this.template().forEach(function (row, y) {
            row.forEach(function (cell, x) {
                if (cell) {
                    ctx.fillRect(_this.x * engine.game.cellSize + x * engine.game.cellSize, _this.y * engine.game.cellSize + y * engine.game.cellSize, engine.game.cellSize, engine.game.cellSize);
                }
            });
        });
    };
    return Piece;
}());
var SPiece = /** @class */ (function (_super) {
    __extends(SPiece, _super);
    function SPiece() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.color = 'blue';
        _this.shape = 's';
        _this.effectdBySystems = [];
        _this.template = function () { return _this.rotate == 0 ? [
            [1, 1, 0],
            [0, 1, 1],
        ] : [
            [0, 1],
            [1, 1],
            [1, 0],
        ]; };
        return _this;
    }
    return SPiece;
}(Piece));
var OPiece = /** @class */ (function (_super) {
    __extends(OPiece, _super);
    function OPiece() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.color = '#FF1493';
        _this.shape = 'o';
        _this.effectdBySystems = [];
        _this.template = function () { return _this.rotate == 0 ? [
            [1, 1, 0],
            [0, 1, 1],
            [1, 1, 0],
        ] : [
            [0, 1, 0],
            [1, 1, 1],
            [1, 0, 1],
        ]; };
        return _this;
    }
    return OPiece;
}(Piece));
var SquarePiece = /** @class */ (function (_super) {
    __extends(SquarePiece, _super);
    function SquarePiece() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.color = 'yellow';
        _this.shape = 'squere';
        _this.effectdBySystems = [];
        _this.template = function () { return [
            [1, 1],
            [1, 1],
        ]; };
        return _this;
    }
    return SquarePiece;
}(Piece));
var LinePiece = /** @class */ (function (_super) {
    __extends(LinePiece, _super);
    function LinePiece() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.color = 'red';
        _this.shape = 'line';
        _this.effectdBySystems = [];
        _this.template = function () { return _this.rotate == 0 ? [
            [1, 1, 1, 1]
        ] : [
            [1],
            [1],
            [1],
            [1]
        ]; };
        return _this;
    }
    return LinePiece;
}(Piece));
var pieces = {
    S: SPiece,
    Line: LinePiece,
    Square: SquarePiece,
    O: OPiece
};
exports["default"] = pieces;


/***/ }),

/***/ "./systems/fix-it.ts":
/*!***************************!*\
  !*** ./systems/fix-it.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function default_1() {
    return {
        name: "fixIt",
        interval: 0,
        effects: function (piece) {
            var _this = this;
            try {
                if (piece.status == 1) {
                    this.score.value += 1;
                    piece.effectdBySystems = [];
                    // random color change from hightlightcolors
                    piece.color = '#ccc';
                    piece.template().forEach(function (row, y) {
                        row.forEach(function (cell, x) {
                            if (cell === 1) {
                                _this.world[piece.y + y][piece.x + x] = 1;
                            }
                        });
                    });
                }
            }
            catch (e) { }
        }
    };
}
exports["default"] = default_1;


/***/ }),

/***/ "./systems/gravity.ts":
/*!****************************!*\
  !*** ./systems/gravity.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.gravity = void 0;
var intersection_1 = __webpack_require__(/*! ../intersection */ "./intersection.ts");
var gravity = function () {
    return {
        name: "gravity",
        interval: 0,
        effects: function (piece) {
            if (piece.y + piece.height < this.game.height && !(0, intersection_1.default)(__assign(__assign({}, piece), { y: piece.y + 1 }), this.world)) {
                piece.y += 1;
            }
            else {
                piece.status = 1;
            }
        },
    };
};
exports.gravity = gravity;


/***/ }),

/***/ "./systems/keyboard.ts":
/*!*****************************!*\
  !*** ./systems/keyboard.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var events_1 = __webpack_require__(/*! ../events */ "./events.ts");
var intersection_1 = __webpack_require__(/*! ../intersection */ "./intersection.ts");
function default_1() {
    var lastEvent = null;
    (0, events_1.listenEvents)(
    // left
    function () {
        lastEvent = 'left';
    }, 
    // right
    function () {
        lastEvent = 'right';
    }, 
    // flip
    function () {
        lastEvent = 'flip';
    });
    var btnLeft = function (piece) {
        if (piece.x > 0
            && !(0, intersection_1.default)(__assign(__assign({}, piece), { x: piece.x - 1 }), this.world)) {
            piece.x -= 1;
        }
    };
    var btnRight = function (piece) {
        if (piece.x < this.game.width - piece.width
            && !(0, intersection_1.default)(__assign(__assign({}, piece), { x: piece.x + 1 }), this.world)) {
            piece.x += 1;
        }
    };
    var btnFlip = function (piece) {
        piece.rotate = piece.rotate == 0 ? 1 : 0;
    };
    return {
        name: "keyboard",
        interval: 1000,
        effects: function (piece) {
            if (piece.status === 0 && lastEvent !== null) {
                switch (lastEvent) {
                    case 'left':
                        btnLeft.bind(this)(piece);
                        break;
                    case 'right':
                        btnRight.bind(this)(piece);
                        break;
                    case 'flip':
                        btnFlip.bind(this)(piece);
                        break;
                    default:
                        break;
                }
                lastEvent = null;
            }
        }
    };
}
exports["default"] = default_1;


/***/ }),

/***/ "./systems/piece-generator.ts":
/*!************************************!*\
  !*** ./systems/piece-generator.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function default_1() {
    return {
        name: "addNewPiece",
        interval: 1000,
        effects: function (piece) {
            if (!this.pieces.find(function (p) { return p.status === 0; })) {
                this.addPiece(this.createRandomPiece());
            }
        }
    };
}
exports["default"] = default_1;


/***/ }),

/***/ "./systems/restart-the-game.ts":
/*!*************************************!*\
  !*** ./systems/restart-the-game.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var constants_1 = __webpack_require__(/*! ../constants */ "./constants.ts");
function default_1() {
    return {
        name: "restartTheGame",
        interval: 1000,
        effects: function (piece) {
            if (this.world[0].some(function (cell) { return cell === 1; })) {
                this.score.value = 0;
                this.pieces = [];
                this.world = JSON.parse(JSON.stringify(constants_1.grid));
                this.addPiece(this.createRandomPiece());
            }
        }
    };
}
exports["default"] = default_1;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!****************!*\
  !*** ./app.ts ***!
  \****************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var engine_1 = __webpack_require__(/*! ./engine */ "./engine.ts");
var fix_it_1 = __webpack_require__(/*! ./systems/fix-it */ "./systems/fix-it.ts");
var gravity_1 = __webpack_require__(/*! ./systems/gravity */ "./systems/gravity.ts");
var keyboard_1 = __webpack_require__(/*! ./systems/keyboard */ "./systems/keyboard.ts");
var piece_generator_1 = __webpack_require__(/*! ./systems/piece-generator */ "./systems/piece-generator.ts");
var restart_the_game_1 = __webpack_require__(/*! ./systems/restart-the-game */ "./systems/restart-the-game.ts");
var canvasElement = window.document.getElementById("screen");
var gameEngine = new engine_1.default(canvasElement);
gameEngine.addSystem((0, gravity_1.gravity)());
gameEngine.addSystem((0, fix_it_1.default)());
gameEngine.addSystem((0, piece_generator_1.default)());
gameEngine.addSystem((0, restart_the_game_1.default)());
gameEngine.addSystem((0, keyboard_1.default)());
gameEngine.addPiece(gameEngine.createRandomPiece());
gameEngine.start();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7OztBQ3RCYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxlQUFlLG1CQUFPLENBQUMsNkJBQVU7QUFDakMsZUFBZSxtQkFBTyxDQUFDLDZDQUFrQjtBQUN6QyxnQkFBZ0IsbUJBQU8sQ0FBQywrQ0FBbUI7QUFDM0MsaUJBQWlCLG1CQUFPLENBQUMsaURBQW9CO0FBQzdDLHdCQUF3QixtQkFBTyxDQUFDLCtEQUEyQjtBQUMzRCx5QkFBeUIsbUJBQU8sQ0FBQyxpRUFBNEI7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vU2NvcmUudHMiLCJ3ZWJwYWNrOi8vLy4vY29uc3RhbnRzLnRzIiwid2VicGFjazovLy8uL2VuZ2luZS50cyIsIndlYnBhY2s6Ly8vLi9ldmVudHMudHMiLCJ3ZWJwYWNrOi8vLy4vaW50ZXJzZWN0aW9uLnRzIiwid2VicGFjazovLy8uL3BpZWNlcy50cyIsIndlYnBhY2s6Ly8vLi9zeXN0ZW1zL2ZpeC1pdC50cyIsIndlYnBhY2s6Ly8vLi9zeXN0ZW1zL2dyYXZpdHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtcy9rZXlib2FyZC50cyIsIndlYnBhY2s6Ly8vLi9zeXN0ZW1zL3BpZWNlLWdlbmVyYXRvci50cyIsIndlYnBhY2s6Ly8vLi9zeXN0ZW1zL3Jlc3RhcnQtdGhlLWdhbWUudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL2FwcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBTY29yZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTY29yZSgpIHtcbiAgICAgICAgdGhpcy54ID0gMTI7XG4gICAgICAgIHRoaXMueSA9IDI0O1xuICAgICAgICB0aGlzLmlkID0gXCJzY29yZVwiO1xuICAgICAgICB0aGlzLnZhbHVlID0gMDtcbiAgICAgICAgY29uc29sZS5sb2coJ3Njb3JlJyk7XG4gICAgfVxuICAgIFNjb3JlLnByb3RvdHlwZS5yZWRyYXcgPSBmdW5jdGlvbiAoZW5naW5lKSB7XG4gICAgICAgIHZhciBjdHggPSBlbmdpbmUuZ2FtZS5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JlZCc7XG4gICAgICAgIGN0eC5mb250ID0gJzE0cHggdGFob21hJztcbiAgICAgICAgY3R4LmZpbGxUZXh0KFwic2NvcmUgW1wiLmNvbmNhdCh0aGlzLnZhbHVlLCBcIl1cIiksIHRoaXMueCwgdGhpcy55KTtcbiAgICB9O1xuICAgIHJldHVybiBTY29yZTtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTY29yZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5oaWdobGlnaHRjb2xvcnMgPSBleHBvcnRzLmdyaWQgPSB2b2lkIDA7XG52YXIgcm93cyA9IDE2O1xudmFyIGNvbHMgPSAxMztcbmV4cG9ydHMuZ3JpZCA9IEFycmF5KHJvd3MpLmZpbGwoQXJyYXkoY29scykuZmlsbCgwKSk7XG5leHBvcnRzLmhpZ2hsaWdodGNvbG9ycyA9IFtcbiAgICAnVmlvbGV0JyxcbiAgICAnSW5kaWdvJyxcbiAgICAnQmx1ZScsXG4gICAgJ0dyZWVuJyxcbiAgICAnWWVsbG93JyxcbiAgICAnT3JhbmdlJyxcbiAgICAnUmVkJyxcbl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBwaWVjZXNfMSA9IHJlcXVpcmUoXCIuL3BpZWNlc1wiKTtcbnZhciBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuL2NvbnN0YW50c1wiKTtcbnZhciBTY29yZV8xID0gcmVxdWlyZShcIi4vU2NvcmVcIik7XG52YXIgR2FtZVN0YXR1cztcbihmdW5jdGlvbiAoR2FtZVN0YXR1cykge1xuICAgIEdhbWVTdGF0dXNbR2FtZVN0YXR1c1tcImluaXRcIl0gPSAwXSA9IFwiaW5pdFwiO1xuICAgIEdhbWVTdGF0dXNbR2FtZVN0YXR1c1tcInBhdXNlXCJdID0gMV0gPSBcInBhdXNlXCI7XG4gICAgR2FtZVN0YXR1c1tHYW1lU3RhdHVzW1wicGxheVwiXSA9IDJdID0gXCJwbGF5XCI7XG4gICAgR2FtZVN0YXR1c1tHYW1lU3RhdHVzW1wiZ2FtZU92ZXJcIl0gPSAzXSA9IFwiZ2FtZU92ZXJcIjtcbn0pKEdhbWVTdGF0dXMgfHwgKEdhbWVTdGF0dXMgPSB7fSkpO1xudmFyIEdhbWVFbmdpbmUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gR2FtZUVuZ2luZShjYW52YXNFbGVtZW50KSB7XG4gICAgICAgIHRoaXMucGllY2VzID0gW107XG4gICAgICAgIHRoaXMuc3lzdGVtcyA9IFtdO1xuICAgICAgICB0aGlzLnJlZnJlc2ggPSA0MDA7XG4gICAgICAgIHRoaXMucmVmcmVzaEhhbmRsZXIgPSBudWxsO1xuICAgICAgICB0aGlzLndvcmxkID0gW107XG4gICAgICAgIHRoaXMuc2NvcmUgPSBudWxsO1xuICAgICAgICB0aGlzLnN0YXR1cyA9IEdhbWVTdGF0dXMuZ2FtZU92ZXI7XG4gICAgICAgIHRoaXMuZ2FtZSA9IHtcbiAgICAgICAgICAgIGNhbnZhczogbnVsbCxcbiAgICAgICAgICAgIGhlaWdodDogY29uc3RhbnRzXzEuZ3JpZC5sZW5ndGgsXG4gICAgICAgICAgICB3aWR0aDogY29uc3RhbnRzXzEuZ3JpZFswXS5sZW5ndGgsXG4gICAgICAgICAgICBjZWxsU2l6ZTogMjAsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnNvbGUubG9nKCdnYW1lIGVuZ2luZSBjcmVhdGVkJyk7XG4gICAgICAgIHRoaXMuZ2FtZS5jYW52YXMgPSBjYW52YXNFbGVtZW50O1xuICAgICAgICB0aGlzLndvcmxkID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShjb25zdGFudHNfMS5ncmlkKSk7XG4gICAgICAgIHRoaXMuc2NvcmUgPSBuZXcgU2NvcmVfMS5kZWZhdWx0KCk7XG4gICAgICAgIHZhciBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXTtcbiAgICAgICAgYm9keS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlU2NyZWVuQ2xpY2suYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIEdhbWVFbmdpbmUucHJvdG90eXBlLmFkZFN5c3RlbSA9IGZ1bmN0aW9uIChzeXN0ZW0pIHtcbiAgICAgICAgdGhpcy5zeXN0ZW1zLnB1c2goc3lzdGVtKTtcbiAgICB9O1xuICAgIEdhbWVFbmdpbmUucHJvdG90eXBlLmFkZFBpZWNlID0gZnVuY3Rpb24gKHBpZWNlKSB7XG4gICAgICAgIHRoaXMucGllY2VzLnB1c2gocGllY2UpO1xuICAgIH07XG4gICAgR2FtZUVuZ2luZS5wcm90b3R5cGUuaGFuZGxlU2NyZWVuQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSBHYW1lU3RhdHVzLmdhbWVPdmVyKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IEdhbWVTdGF0dXMucGxheTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnN0YXR1cyA9PSBHYW1lU3RhdHVzLnBhdXNlKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IEdhbWVTdGF0dXMucGxheTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnN0YXR1cyA9PSBHYW1lU3RhdHVzLnBsYXkpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gR2FtZVN0YXR1cy5wYXVzZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgR2FtZUVuZ2luZS5wcm90b3R5cGUuY2xlYXJDYW52YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjdHggPSB0aGlzLmdhbWUuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5nYW1lLndpZHRoICogdGhpcy5nYW1lLmNlbGxTaXplLCB0aGlzLmdhbWUuaGVpZ2h0ICogdGhpcy5nYW1lLmNlbGxTaXplKTtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMDAwJztcbiAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuZ2FtZS53aWR0aCAqIHRoaXMuZ2FtZS5jZWxsU2l6ZSwgdGhpcy5nYW1lLmhlaWdodCAqIHRoaXMuZ2FtZS5jZWxsU2l6ZSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5nYW1lLndpZHRoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIC8vIHJhbmRvbSBjb2xvcnMgZnJvbSBoaWdobGlnaGNvbG9yc1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLmdhbWUuaGVpZ2h0OyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gY29uc3RhbnRzXzEuaGlnaGxpZ2h0Y29sb3JzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbnN0YW50c18xLmhpZ2hsaWdodGNvbG9ycy5sZW5ndGgpXTtcbiAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoaSAqIHRoaXMuZ2FtZS5jZWxsU2l6ZSwgaiAqIHRoaXMuZ2FtZS5jZWxsU2l6ZSwgMSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEdhbWVFbmdpbmUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jbGVhckNhbnZhcygpO1xuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT0gR2FtZVN0YXR1cy5nYW1lT3Zlcikge1xuICAgICAgICAgICAgdmFyIGN0eF8xID0gdGhpcy5nYW1lLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgICAgICBjdHhfMS5maWxsU3R5bGUgPSAneWVsbG93JztcbiAgICAgICAgICAgIGN0eF8xLmZvbnQgPSAnMTRweCB0YWhvbWEnO1xuICAgICAgICAgICAgdmFyIG1lc3NhZ2VzID0gW1xuICAgICAgICAgICAgICAgICcgV0VMQ09NRScsXG4gICAgICAgICAgICAgICAgJyAgdGFwIHNjcmVlbidcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBtZXNzYWdlcy5mb3JFYWNoKGZ1bmN0aW9uIChtc2csIGkpIHtcbiAgICAgICAgICAgICAgICBjdHhfMS5maWxsVGV4dChtc2csIChNYXRoLmZsb29yKF90aGlzLmdhbWUud2lkdGggLyAyKSkgKiBfdGhpcy5nYW1lLmNlbGxTaXplIC0gbXNnLmxlbmd0aCAqIDIsIE1hdGguZmxvb3IoX3RoaXMuZ2FtZS5oZWlnaHQgLyAyKSAqIF90aGlzLmdhbWUuY2VsbFNpemUgKyBpICogX3RoaXMuZ2FtZS5jZWxsU2l6ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnN0YXR1cyA9PSBHYW1lU3RhdHVzLnBsYXkpIHtcbiAgICAgICAgICAgIHRoaXMucGllY2VzLmZvckVhY2goZnVuY3Rpb24gKHBpZWNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVmZmVjdGVkQnkgPSBwaWVjZS5lZmZlY3RkQnlTeXN0ZW1zIHx8IFtdO1xuICAgICAgICAgICAgICAgIGVmZmVjdGVkQnkuZm9yRWFjaChmdW5jdGlvbiAoc3lzdGVtTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3lzdGVtID0gX3RoaXMuc3lzdGVtcy5maW5kKGZ1bmN0aW9uIChzKSB7IHJldHVybiBzLm5hbWUgPT09IHN5c3RlbU5hbWU7IH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3lzdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzeXN0ZW0uZWZmZWN0cy5iaW5kKF90aGlzKShwaWVjZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBwaWVjZS5yZWRyYXcoX3RoaXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnNjb3JlLnJlZHJhdyh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnN0YXR1cyA9PSBHYW1lU3RhdHVzLnBhdXNlKSB7XG4gICAgICAgICAgICB0aGlzLnBpZWNlcy5mb3JFYWNoKGZ1bmN0aW9uIChwaWVjZSkge1xuICAgICAgICAgICAgICAgIHBpZWNlLnJlZHJhdyhfdGhpcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuc2NvcmUucmVkcmF3KHRoaXMpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBHYW1lRW5naW5lLnByb3RvdHlwZS5jcmVhdGVSYW5kb21QaWVjZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBpZWNlc05hbWVzID0gT2JqZWN0LmtleXMocGllY2VzXzEuZGVmYXVsdCk7XG4gICAgICAgIHZhciByYW5kb21QaWVjZU5hbWUgPSBwaWVjZXNOYW1lc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwaWVjZXNOYW1lcy5sZW5ndGgpXTtcbiAgICAgICAgdmFyIHggPSBNYXRoLmZsb29yKHRoaXMuZ2FtZS53aWR0aCAvIDIpIC0gMTtcbiAgICAgICAgY29uc29sZS5sb2coJ3JhbmRvbVBpZWNlTmFtZScsIHJhbmRvbVBpZWNlTmFtZSk7XG4gICAgICAgIHZhciByYW5kb21QaWVjZSA9IHBpZWNlc18xLmRlZmF1bHRbcmFuZG9tUGllY2VOYW1lXTtcbiAgICAgICAgdmFyIHJhbmRvbVBpZWNlSW5zdGFuY2UgPSBuZXcgcmFuZG9tUGllY2UoKTtcbiAgICAgICAgcmFuZG9tUGllY2VJbnN0YW5jZS5lZmZlY3RkQnlTeXN0ZW1zID0gWydncmF2aXR5JywgJ2ZpeEl0JywgJ2FkZE5ld1BpZWNlJywgJ3Jlc3RhcnRUaGVHYW1lJywgJ2tleWJvYXJkJ107XG4gICAgICAgIHJhbmRvbVBpZWNlSW5zdGFuY2UueCA9IHg7XG4gICAgICAgIHJhbmRvbVBpZWNlSW5zdGFuY2UueSA9IDA7XG4gICAgICAgIC8vIGFkZCByYW5kb20gc3RyaW5nIGlkXG4gICAgICAgIHJhbmRvbVBpZWNlSW5zdGFuY2UuaWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTUpICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDE1KTtcbiAgICAgICAgcmV0dXJuIHJhbmRvbVBpZWNlSW5zdGFuY2U7XG4gICAgfTtcbiAgICBHYW1lRW5naW5lLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dhbWUgc3RhcnRlZCcpO1xuICAgICAgICB0aGlzLnJlZnJlc2hIYW5kbGVyID0gc2V0SW50ZXJ2YWwodGhpcy51cGRhdGUuYmluZCh0aGlzKSwgdGhpcy5yZWZyZXNoKTtcbiAgICB9O1xuICAgIHJldHVybiBHYW1lRW5naW5lO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IEdhbWVFbmdpbmU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMubGlzdGVuRXZlbnRzID0gdm9pZCAwO1xudmFyIGxpc3RlbkV2ZW50cyA9IGZ1bmN0aW9uIChidG5MZWZ0LCBidG5SaWdodCwgYnRuRmxpcCkge1xuICAgIHZhciBsZWZ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bi1sZWZ0Jyk7XG4gICAgbGVmdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGJ0bkxlZnQoZSk7XG4gICAgfSk7XG4gICAgdmFyIHJpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bi1yaWdodCcpO1xuICAgIHJpZ2h0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgYnRuUmlnaHQoZSk7XG4gICAgfSk7XG4gICAgdmFyIGZsaXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuLWZsaXAnKTtcbiAgICBmbGlwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgYnRuRmxpcChlKTtcbiAgICB9KTtcbn07XG5leHBvcnRzLmxpc3RlbkV2ZW50cyA9IGxpc3RlbkV2ZW50cztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChwaWVjZSwgd29ybGQpIHtcbiAgICB2YXIgaGl0UGllY2UgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICByZXR1cm4gcGllY2UudGVtcGxhdGUoKS5zb21lKGZ1bmN0aW9uIChyb3csIGopIHtcbiAgICAgICAgICAgIHJldHVybiByb3cuc29tZShmdW5jdGlvbiAoYywgaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjID09PSAxICYmIHBpZWNlLnggKyBpID09PSB4ICYmIHBpZWNlLnkgKyBqID09PSB5O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIHdvcmxkLnNvbWUoZnVuY3Rpb24gKHJvdywgeSkge1xuICAgICAgICByZXR1cm4gcm93LnNvbWUoZnVuY3Rpb24gKGNlbGwsIHgpIHtcbiAgICAgICAgICAgIHJldHVybiBjZWxsICE9PSAwICYmIGhpdFBpZWNlKHgsIHkpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFBpZWNlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBpZWNlKCkge1xuICAgICAgICB0aGlzLnggPSAwO1xuICAgICAgICB0aGlzLnkgPSAwO1xuICAgICAgICB0aGlzLmlkID0gJyc7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gMDtcbiAgICAgICAgdGhpcy5yb3RhdGUgPSAwO1xuICAgICAgICB0aGlzLmNvbG9yID0gJ3JlZCc7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQaWVjZS5wcm90b3R5cGUsIFwiaGVpZ2h0XCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZSgpLmxlbmd0aDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQaWVjZS5wcm90b3R5cGUsIFwid2lkdGhcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlKClbMF0ubGVuZ3RoO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgUGllY2UucHJvdG90eXBlLm1vdmVMZWZ0ID0gZnVuY3Rpb24gKGVuZ2luZSkge1xuICAgICAgICBpZiAoZW5naW5lLmNhbk1vdmUoLTEsIDApKSB7XG4gICAgICAgICAgICB0aGlzLngtLTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGllY2UucHJvdG90eXBlLnJlZHJhdyA9IGZ1bmN0aW9uIChlbmdpbmUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGN0eCA9IGVuZ2luZS5nYW1lLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xuICAgICAgICB0aGlzLnRlbXBsYXRlKCkuZm9yRWFjaChmdW5jdGlvbiAocm93LCB5KSB7XG4gICAgICAgICAgICByb3cuZm9yRWFjaChmdW5jdGlvbiAoY2VsbCwgeCkge1xuICAgICAgICAgICAgICAgIGlmIChjZWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdChfdGhpcy54ICogZW5naW5lLmdhbWUuY2VsbFNpemUgKyB4ICogZW5naW5lLmdhbWUuY2VsbFNpemUsIF90aGlzLnkgKiBlbmdpbmUuZ2FtZS5jZWxsU2l6ZSArIHkgKiBlbmdpbmUuZ2FtZS5jZWxsU2l6ZSwgZW5naW5lLmdhbWUuY2VsbFNpemUsIGVuZ2luZS5nYW1lLmNlbGxTaXplKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gUGllY2U7XG59KCkpO1xudmFyIFNQaWVjZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU1BpZWNlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFNQaWVjZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmNvbG9yID0gJ2JsdWUnO1xuICAgICAgICBfdGhpcy5zaGFwZSA9ICdzJztcbiAgICAgICAgX3RoaXMuZWZmZWN0ZEJ5U3lzdGVtcyA9IFtdO1xuICAgICAgICBfdGhpcy50ZW1wbGF0ZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLnJvdGF0ZSA9PSAwID8gW1xuICAgICAgICAgICAgWzEsIDEsIDBdLFxuICAgICAgICAgICAgWzAsIDEsIDFdLFxuICAgICAgICBdIDogW1xuICAgICAgICAgICAgWzAsIDFdLFxuICAgICAgICAgICAgWzEsIDFdLFxuICAgICAgICAgICAgWzEsIDBdLFxuICAgICAgICBdOyB9O1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBTUGllY2U7XG59KFBpZWNlKSk7XG52YXIgT1BpZWNlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhPUGllY2UsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gT1BpZWNlKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuY29sb3IgPSAnI0ZGMTQ5Myc7XG4gICAgICAgIF90aGlzLnNoYXBlID0gJ28nO1xuICAgICAgICBfdGhpcy5lZmZlY3RkQnlTeXN0ZW1zID0gW107XG4gICAgICAgIF90aGlzLnRlbXBsYXRlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMucm90YXRlID09IDAgPyBbXG4gICAgICAgICAgICBbMSwgMSwgMF0sXG4gICAgICAgICAgICBbMCwgMSwgMV0sXG4gICAgICAgICAgICBbMSwgMSwgMF0sXG4gICAgICAgIF0gOiBbXG4gICAgICAgICAgICBbMCwgMSwgMF0sXG4gICAgICAgICAgICBbMSwgMSwgMV0sXG4gICAgICAgICAgICBbMSwgMCwgMV0sXG4gICAgICAgIF07IH07XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIE9QaWVjZTtcbn0oUGllY2UpKTtcbnZhciBTcXVhcmVQaWVjZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU3F1YXJlUGllY2UsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU3F1YXJlUGllY2UoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5jb2xvciA9ICd5ZWxsb3cnO1xuICAgICAgICBfdGhpcy5zaGFwZSA9ICdzcXVlcmUnO1xuICAgICAgICBfdGhpcy5lZmZlY3RkQnlTeXN0ZW1zID0gW107XG4gICAgICAgIF90aGlzLnRlbXBsYXRlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW1xuICAgICAgICAgICAgWzEsIDFdLFxuICAgICAgICAgICAgWzEsIDFdLFxuICAgICAgICBdOyB9O1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBTcXVhcmVQaWVjZTtcbn0oUGllY2UpKTtcbnZhciBMaW5lUGllY2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKExpbmVQaWVjZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBMaW5lUGllY2UoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5jb2xvciA9ICdyZWQnO1xuICAgICAgICBfdGhpcy5zaGFwZSA9ICdsaW5lJztcbiAgICAgICAgX3RoaXMuZWZmZWN0ZEJ5U3lzdGVtcyA9IFtdO1xuICAgICAgICBfdGhpcy50ZW1wbGF0ZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLnJvdGF0ZSA9PSAwID8gW1xuICAgICAgICAgICAgWzEsIDEsIDEsIDFdXG4gICAgICAgIF0gOiBbXG4gICAgICAgICAgICBbMV0sXG4gICAgICAgICAgICBbMV0sXG4gICAgICAgICAgICBbMV0sXG4gICAgICAgICAgICBbMV1cbiAgICAgICAgXTsgfTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gTGluZVBpZWNlO1xufShQaWVjZSkpO1xudmFyIHBpZWNlcyA9IHtcbiAgICBTOiBTUGllY2UsXG4gICAgTGluZTogTGluZVBpZWNlLFxuICAgIFNxdWFyZTogU3F1YXJlUGllY2UsXG4gICAgTzogT1BpZWNlXG59O1xuZXhwb3J0cy5kZWZhdWx0ID0gcGllY2VzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBkZWZhdWx0XzEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogXCJmaXhJdFwiLFxuICAgICAgICBpbnRlcnZhbDogMCxcbiAgICAgICAgZWZmZWN0czogZnVuY3Rpb24gKHBpZWNlKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAocGllY2Uuc3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY29yZS52YWx1ZSArPSAxO1xuICAgICAgICAgICAgICAgICAgICBwaWVjZS5lZmZlY3RkQnlTeXN0ZW1zID0gW107XG4gICAgICAgICAgICAgICAgICAgIC8vIHJhbmRvbSBjb2xvciBjaGFuZ2UgZnJvbSBoaWdodGxpZ2h0Y29sb3JzXG4gICAgICAgICAgICAgICAgICAgIHBpZWNlLmNvbG9yID0gJyNjY2MnO1xuICAgICAgICAgICAgICAgICAgICBwaWVjZS50ZW1wbGF0ZSgpLmZvckVhY2goZnVuY3Rpb24gKHJvdywgeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93LmZvckVhY2goZnVuY3Rpb24gKGNlbGwsIHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy53b3JsZFtwaWVjZS55ICsgeV1bcGllY2UueCArIHhdID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHsgfVxuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydHMuZGVmYXVsdCA9IGRlZmF1bHRfMTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ3Jhdml0eSA9IHZvaWQgMDtcbnZhciBpbnRlcnNlY3Rpb25fMSA9IHJlcXVpcmUoXCIuLi9pbnRlcnNlY3Rpb25cIik7XG52YXIgZ3Jhdml0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBcImdyYXZpdHlcIixcbiAgICAgICAgaW50ZXJ2YWw6IDAsXG4gICAgICAgIGVmZmVjdHM6IGZ1bmN0aW9uIChwaWVjZSkge1xuICAgICAgICAgICAgaWYgKHBpZWNlLnkgKyBwaWVjZS5oZWlnaHQgPCB0aGlzLmdhbWUuaGVpZ2h0ICYmICEoMCwgaW50ZXJzZWN0aW9uXzEuZGVmYXVsdCkoX19hc3NpZ24oX19hc3NpZ24oe30sIHBpZWNlKSwgeyB5OiBwaWVjZS55ICsgMSB9KSwgdGhpcy53b3JsZCkpIHtcbiAgICAgICAgICAgICAgICBwaWVjZS55ICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwaWVjZS5zdGF0dXMgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH07XG59O1xuZXhwb3J0cy5ncmF2aXR5ID0gZ3Jhdml0eTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBldmVudHNfMSA9IHJlcXVpcmUoXCIuLi9ldmVudHNcIik7XG52YXIgaW50ZXJzZWN0aW9uXzEgPSByZXF1aXJlKFwiLi4vaW50ZXJzZWN0aW9uXCIpO1xuZnVuY3Rpb24gZGVmYXVsdF8xKCkge1xuICAgIHZhciBsYXN0RXZlbnQgPSBudWxsO1xuICAgICgwLCBldmVudHNfMS5saXN0ZW5FdmVudHMpKFxuICAgIC8vIGxlZnRcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxhc3RFdmVudCA9ICdsZWZ0JztcbiAgICB9LCBcbiAgICAvLyByaWdodFxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGFzdEV2ZW50ID0gJ3JpZ2h0JztcbiAgICB9LCBcbiAgICAvLyBmbGlwXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgICBsYXN0RXZlbnQgPSAnZmxpcCc7XG4gICAgfSk7XG4gICAgdmFyIGJ0bkxlZnQgPSBmdW5jdGlvbiAocGllY2UpIHtcbiAgICAgICAgaWYgKHBpZWNlLnggPiAwXG4gICAgICAgICAgICAmJiAhKDAsIGludGVyc2VjdGlvbl8xLmRlZmF1bHQpKF9fYXNzaWduKF9fYXNzaWduKHt9LCBwaWVjZSksIHsgeDogcGllY2UueCAtIDEgfSksIHRoaXMud29ybGQpKSB7XG4gICAgICAgICAgICBwaWVjZS54IC09IDE7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciBidG5SaWdodCA9IGZ1bmN0aW9uIChwaWVjZSkge1xuICAgICAgICBpZiAocGllY2UueCA8IHRoaXMuZ2FtZS53aWR0aCAtIHBpZWNlLndpZHRoXG4gICAgICAgICAgICAmJiAhKDAsIGludGVyc2VjdGlvbl8xLmRlZmF1bHQpKF9fYXNzaWduKF9fYXNzaWduKHt9LCBwaWVjZSksIHsgeDogcGllY2UueCArIDEgfSksIHRoaXMud29ybGQpKSB7XG4gICAgICAgICAgICBwaWVjZS54ICs9IDE7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciBidG5GbGlwID0gZnVuY3Rpb24gKHBpZWNlKSB7XG4gICAgICAgIHBpZWNlLnJvdGF0ZSA9IHBpZWNlLnJvdGF0ZSA9PSAwID8gMSA6IDA7XG4gICAgfTtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBcImtleWJvYXJkXCIsXG4gICAgICAgIGludGVydmFsOiAxMDAwLFxuICAgICAgICBlZmZlY3RzOiBmdW5jdGlvbiAocGllY2UpIHtcbiAgICAgICAgICAgIGlmIChwaWVjZS5zdGF0dXMgPT09IDAgJiYgbGFzdEV2ZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChsYXN0RXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBidG5MZWZ0LmJpbmQodGhpcykocGllY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ0blJpZ2h0LmJpbmQodGhpcykocGllY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2ZsaXAnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYnRuRmxpcC5iaW5kKHRoaXMpKHBpZWNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxhc3RFdmVudCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gZGVmYXVsdF8xO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBkZWZhdWx0XzEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogXCJhZGROZXdQaWVjZVwiLFxuICAgICAgICBpbnRlcnZhbDogMTAwMCxcbiAgICAgICAgZWZmZWN0czogZnVuY3Rpb24gKHBpZWNlKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucGllY2VzLmZpbmQoZnVuY3Rpb24gKHApIHsgcmV0dXJuIHAuc3RhdHVzID09PSAwOyB9KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkUGllY2UodGhpcy5jcmVhdGVSYW5kb21QaWVjZSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLmRlZmF1bHQgPSBkZWZhdWx0XzE7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5mdW5jdGlvbiBkZWZhdWx0XzEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogXCJyZXN0YXJ0VGhlR2FtZVwiLFxuICAgICAgICBpbnRlcnZhbDogMTAwMCxcbiAgICAgICAgZWZmZWN0czogZnVuY3Rpb24gKHBpZWNlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy53b3JsZFswXS5zb21lKGZ1bmN0aW9uIChjZWxsKSB7IHJldHVybiBjZWxsID09PSAxOyB9KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NvcmUudmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMucGllY2VzID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoY29uc3RhbnRzXzEuZ3JpZCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkUGllY2UodGhpcy5jcmVhdGVSYW5kb21QaWVjZSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLmRlZmF1bHQgPSBkZWZhdWx0XzE7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgZW5naW5lXzEgPSByZXF1aXJlKFwiLi9lbmdpbmVcIik7XG52YXIgZml4X2l0XzEgPSByZXF1aXJlKFwiLi9zeXN0ZW1zL2ZpeC1pdFwiKTtcbnZhciBncmF2aXR5XzEgPSByZXF1aXJlKFwiLi9zeXN0ZW1zL2dyYXZpdHlcIik7XG52YXIga2V5Ym9hcmRfMSA9IHJlcXVpcmUoXCIuL3N5c3RlbXMva2V5Ym9hcmRcIik7XG52YXIgcGllY2VfZ2VuZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9zeXN0ZW1zL3BpZWNlLWdlbmVyYXRvclwiKTtcbnZhciByZXN0YXJ0X3RoZV9nYW1lXzEgPSByZXF1aXJlKFwiLi9zeXN0ZW1zL3Jlc3RhcnQtdGhlLWdhbWVcIik7XG52YXIgY2FudmFzRWxlbWVudCA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcmVlblwiKTtcbnZhciBnYW1lRW5naW5lID0gbmV3IGVuZ2luZV8xLmRlZmF1bHQoY2FudmFzRWxlbWVudCk7XG5nYW1lRW5naW5lLmFkZFN5c3RlbSgoMCwgZ3Jhdml0eV8xLmdyYXZpdHkpKCkpO1xuZ2FtZUVuZ2luZS5hZGRTeXN0ZW0oKDAsIGZpeF9pdF8xLmRlZmF1bHQpKCkpO1xuZ2FtZUVuZ2luZS5hZGRTeXN0ZW0oKDAsIHBpZWNlX2dlbmVyYXRvcl8xLmRlZmF1bHQpKCkpO1xuZ2FtZUVuZ2luZS5hZGRTeXN0ZW0oKDAsIHJlc3RhcnRfdGhlX2dhbWVfMS5kZWZhdWx0KSgpKTtcbmdhbWVFbmdpbmUuYWRkU3lzdGVtKCgwLCBrZXlib2FyZF8xLmRlZmF1bHQpKCkpO1xuZ2FtZUVuZ2luZS5hZGRQaWVjZShnYW1lRW5naW5lLmNyZWF0ZVJhbmRvbVBpZWNlKCkpO1xuZ2FtZUVuZ2luZS5zdGFydCgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9