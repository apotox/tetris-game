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
var types_1 = __webpack_require__(/*! ./types */ "./types.ts");
var pieces_1 = __webpack_require__(/*! ./pieces */ "./pieces.ts");
var constants_1 = __webpack_require__(/*! ./constants */ "./constants.ts");
var Score_1 = __webpack_require__(/*! ./Score */ "./Score.ts");
var PLAY_INTERVAL = 100;
var PAUSE_INTERVAL = 40;
var GameEngine = /** @class */ (function () {
    function GameEngine(canvasElement) {
        this.pieces = [];
        this.systems = [];
        this.refresh = PAUSE_INTERVAL;
        this.refreshHandler = null;
        this.world = [];
        this.score = null;
        this.status = types_1.GameStatus.gameOver;
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
    GameEngine.prototype.configSystem = function (systemName, options) {
        var system = this.systems.find(function (s) { return s.name === systemName; });
        if (system) {
            system.options = __assign(__assign({}, system.options), options);
        }
    };
    GameEngine.prototype.addPiece = function (piece) {
        this.pieces.push(piece);
    };
    GameEngine.prototype.handleScreenClick = function () {
        if (this.status == types_1.GameStatus.gameOver) {
            this.status = types_1.GameStatus.play;
        }
        else if (this.status == types_1.GameStatus.pause) {
            this.status = types_1.GameStatus.play;
        }
        else if (this.status == types_1.GameStatus.play) {
            this.status = types_1.GameStatus.pause;
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
    GameEngine.prototype.updateRefreshTime = function (time) {
        this.refresh = time;
        if (this.refreshHandler) {
            clearInterval(this.refreshHandler);
        }
        this.start();
    };
    GameEngine.prototype.update = function () {
        var _this = this;
        this.clearCanvas();
        if (this.status == types_1.GameStatus.gameOver) {
            this.updateRefreshTime(PAUSE_INTERVAL);
            this.configSystem("fixIt", { enabled: false });
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
        else if (this.status == types_1.GameStatus.play) {
            this.updateRefreshTime(PLAY_INTERVAL);
            this.configSystem("fixIt", { enabled: true });
            this.pieces.forEach(function (piece) {
                var effectedBy = piece.effectdBySystems || [];
                effectedBy.forEach(function (systemName) {
                    var system = _this.systems.find(function (s) { return s.name === systemName; });
                    if (system && system.options.enabled) {
                        system.effects.bind(_this)(piece);
                    }
                });
                piece.redraw(_this);
            });
            this.score.redraw(this);
        }
        else if (this.status == types_1.GameStatus.pause) {
            this.updateRefreshTime(PAUSE_INTERVAL);
            this.configSystem("fixIt", { enabled: false });
            this.pieces.forEach(function (piece) {
                piece.redraw(_this);
            });
            this.score.redraw(this);
        }
    };
    GameEngine.prototype.createRandomPiece = function () {
        var piecesNames = Object.keys(pieces_1.default);
        var randomPieceName = piecesNames[Math.floor(Math.random() * piecesNames.length)];
        var x = this.status == types_1.GameStatus.pause ? Math.floor(Math.random() * this.game.width) : Math.floor(this.game.width / 2);
        var randomPiece = pieces_1.default[randomPieceName];
        var randomPieceInstance = new randomPiece();
        randomPieceInstance.effectdBySystems = ['gravity', 'fixIt', 'addNewPiece', 'restartTheGame', 'keyboard'];
        randomPieceInstance.x = x;
        randomPieceInstance.y = 0;
        return randomPieceInstance;
    };
    GameEngine.prototype.start = function () {
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
        this.templates = [];
        this.color = 'red';
        this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    Piece.prototype.flip = function () {
        this.rotate = (this.rotate + 1) % this.templates.length;
    };
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
        var _this = _super.call(this) || this;
        _this.color = 'blue';
        _this.shape = 's';
        _this.effectdBySystems = [];
        _this.template = function () { return _this.templates[_this.rotate]; };
        _this.templates = [
            [
                [1, 1, 0],
                [0, 1, 1],
            ],
            [
                [0, 1],
                [1, 1],
                [1, 0],
            ]
        ];
        return _this;
    }
    return SPiece;
}(Piece));
var OPiece = /** @class */ (function (_super) {
    __extends(OPiece, _super);
    function OPiece() {
        var _this = _super.call(this) || this;
        _this.color = '#FF1493';
        _this.shape = 'o';
        _this.effectdBySystems = [];
        _this.template = function () { return _this.templates[_this.rotate]; };
        _this.templates = [
            [
                [1, 1, 0],
                [0, 1, 1],
                [1, 1, 0],
            ],
            [
                [0, 1, 0],
                [1, 1, 1],
                [1, 0, 1],
            ],
            [
                [0, 1, 1],
                [1, 1, 0],
                [0, 1, 1],
            ],
            [
                [1, 0, 1],
                [1, 1, 1],
                [0, 1, 0],
            ]
        ];
        return _this;
    }
    return OPiece;
}(Piece));
var SquarePiece = /** @class */ (function (_super) {
    __extends(SquarePiece, _super);
    function SquarePiece() {
        var _this = _super.call(this) || this;
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
        var _this = _super.call(this) || this;
        _this.color = 'red';
        _this.shape = 'line';
        _this.effectdBySystems = [];
        _this.template = function () { return _this.templates[_this.rotate]; };
        _this.templates = [
            [[1, 1, 1, 1]],
            [
                [1],
                [1],
                [1],
                [1]
            ]
        ];
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
        options: {
            interval: 1000,
            enabled: true
        },
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

/***/ "./systems/fliper.ts":
/*!***************************!*\
  !*** ./systems/fliper.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function default_1() {
    return {
        name: "fliper",
        options: {
            interval: 1000,
            enabled: true
        },
        effects: function (piece) {
            try {
                piece.flip();
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
        options: {
            interval: 1000,
            enabled: true
        },
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
        piece.flip();
    };
    return {
        name: "keyboard",
        options: {
            interval: 1000,
            enabled: true
        },
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
        options: {
            interval: 1000,
            enabled: true
        },
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
        options: {
            interval: 1000,
            enabled: true
        },
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


/***/ }),

/***/ "./types.ts":
/*!******************!*\
  !*** ./types.ts ***!
  \******************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameStatus = void 0;
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["init"] = 0] = "init";
    GameStatus[GameStatus["pause"] = 1] = "pause";
    GameStatus[GameStatus["play"] = 2] = "play";
    GameStatus[GameStatus["gameOver"] = 3] = "gameOver";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));


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
var fliper_1 = __webpack_require__(/*! ./systems/fliper */ "./systems/fliper.ts");
var gravity_1 = __webpack_require__(/*! ./systems/gravity */ "./systems/gravity.ts");
var keyboard_1 = __webpack_require__(/*! ./systems/keyboard */ "./systems/keyboard.ts");
var piece_generator_1 = __webpack_require__(/*! ./systems/piece-generator */ "./systems/piece-generator.ts");
var restart_the_game_1 = __webpack_require__(/*! ./systems/restart-the-game */ "./systems/restart-the-game.ts");
var canvasElement = window.document.getElementById("screen");
var gameEngine = new engine_1.default(canvasElement);
gameEngine.addSystem((0, gravity_1.gravity)());
gameEngine.addSystem((0, fix_it_1.default)());
gameEngine.addSystem((0, fliper_1.default)());
gameEngine.addSystem((0, piece_generator_1.default)());
gameEngine.addSystem((0, restart_the_game_1.default)());
gameEngine.addSystem((0, keyboard_1.default)());
gameEngine.addPiece(gameEngine.createRandomPiece());
gameEngine.start();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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N0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWU7Ozs7Ozs7Ozs7O0FDOUpGO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7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b0I7QUFDN0Msd0JBQXdCLG1CQUFPLENBQUMsK0RBQTJCO0FBQzNELHlCQUF5QixtQkFBTyxDQUFDLGlFQUE0QjtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL1Njb3JlLnRzIiwid2VicGFjazovLy8uL2NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi9lbmdpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vZXZlbnRzLnRzIiwid2VicGFjazovLy8uL2ludGVyc2VjdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9waWVjZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtcy9maXgtaXQudHMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtcy9mbGlwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtcy9ncmF2aXR5LnRzIiwid2VicGFjazovLy8uL3N5c3RlbXMva2V5Ym9hcmQudHMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtcy9waWVjZS1nZW5lcmF0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3lzdGVtcy9yZXN0YXJ0LXRoZS1nYW1lLnRzIiwid2VicGFjazovLy8uL3R5cGVzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9hcHAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgU2NvcmUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2NvcmUoKSB7XG4gICAgICAgIHRoaXMueCA9IDEyO1xuICAgICAgICB0aGlzLnkgPSAyNDtcbiAgICAgICAgdGhpcy5pZCA9IFwic2NvcmVcIjtcbiAgICAgICAgdGhpcy52YWx1ZSA9IDA7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzY29yZScpO1xuICAgIH1cbiAgICBTY29yZS5wcm90b3R5cGUucmVkcmF3ID0gZnVuY3Rpb24gKGVuZ2luZSkge1xuICAgICAgICB2YXIgY3R4ID0gZW5naW5lLmdhbWUuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZWQnO1xuICAgICAgICBjdHguZm9udCA9ICcxNHB4IHRhaG9tYSc7XG4gICAgICAgIGN0eC5maWxsVGV4dChcInNjb3JlIFtcIi5jb25jYXQodGhpcy52YWx1ZSwgXCJdXCIpLCB0aGlzLngsIHRoaXMueSk7XG4gICAgfTtcbiAgICByZXR1cm4gU2NvcmU7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gU2NvcmU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaGlnaGxpZ2h0Y29sb3JzID0gZXhwb3J0cy5ncmlkID0gdm9pZCAwO1xudmFyIHJvd3MgPSAxNjtcbnZhciBjb2xzID0gMTM7XG5leHBvcnRzLmdyaWQgPSBBcnJheShyb3dzKS5maWxsKEFycmF5KGNvbHMpLmZpbGwoMCkpO1xuZXhwb3J0cy5oaWdobGlnaHRjb2xvcnMgPSBbXG4gICAgJ1Zpb2xldCcsXG4gICAgJ0luZGlnbycsXG4gICAgJ0JsdWUnLFxuICAgICdHcmVlbicsXG4gICAgJ1llbGxvdycsXG4gICAgJ09yYW5nZScsXG4gICAgJ1JlZCcsXG5dO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHR5cGVzXzEgPSByZXF1aXJlKFwiLi90eXBlc1wiKTtcbnZhciBwaWVjZXNfMSA9IHJlcXVpcmUoXCIuL3BpZWNlc1wiKTtcbnZhciBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuL2NvbnN0YW50c1wiKTtcbnZhciBTY29yZV8xID0gcmVxdWlyZShcIi4vU2NvcmVcIik7XG52YXIgUExBWV9JTlRFUlZBTCA9IDEwMDtcbnZhciBQQVVTRV9JTlRFUlZBTCA9IDQwO1xudmFyIEdhbWVFbmdpbmUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gR2FtZUVuZ2luZShjYW52YXNFbGVtZW50KSB7XG4gICAgICAgIHRoaXMucGllY2VzID0gW107XG4gICAgICAgIHRoaXMuc3lzdGVtcyA9IFtdO1xuICAgICAgICB0aGlzLnJlZnJlc2ggPSBQQVVTRV9JTlRFUlZBTDtcbiAgICAgICAgdGhpcy5yZWZyZXNoSGFuZGxlciA9IG51bGw7XG4gICAgICAgIHRoaXMud29ybGQgPSBbXTtcbiAgICAgICAgdGhpcy5zY29yZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gdHlwZXNfMS5HYW1lU3RhdHVzLmdhbWVPdmVyO1xuICAgICAgICB0aGlzLmdhbWUgPSB7XG4gICAgICAgICAgICBjYW52YXM6IG51bGwsXG4gICAgICAgICAgICBoZWlnaHQ6IGNvbnN0YW50c18xLmdyaWQubGVuZ3RoLFxuICAgICAgICAgICAgd2lkdGg6IGNvbnN0YW50c18xLmdyaWRbMF0ubGVuZ3RoLFxuICAgICAgICAgICAgY2VsbFNpemU6IDIwLFxuICAgICAgICB9O1xuICAgICAgICBjb25zb2xlLmxvZygnZ2FtZSBlbmdpbmUgY3JlYXRlZCcpO1xuICAgICAgICB0aGlzLmdhbWUuY2FudmFzID0gY2FudmFzRWxlbWVudDtcbiAgICAgICAgdGhpcy53b3JsZCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoY29uc3RhbnRzXzEuZ3JpZCkpO1xuICAgICAgICB0aGlzLnNjb3JlID0gbmV3IFNjb3JlXzEuZGVmYXVsdCgpO1xuICAgICAgICB2YXIgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF07XG4gICAgICAgIGJvZHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZVNjcmVlbkNsaWNrLmJpbmQodGhpcykpO1xuICAgIH1cbiAgICBHYW1lRW5naW5lLnByb3RvdHlwZS5hZGRTeXN0ZW0gPSBmdW5jdGlvbiAoc3lzdGVtKSB7XG4gICAgICAgIHRoaXMuc3lzdGVtcy5wdXNoKHN5c3RlbSk7XG4gICAgfTtcbiAgICBHYW1lRW5naW5lLnByb3RvdHlwZS5jb25maWdTeXN0ZW0gPSBmdW5jdGlvbiAoc3lzdGVtTmFtZSwgb3B0aW9ucykge1xuICAgICAgICB2YXIgc3lzdGVtID0gdGhpcy5zeXN0ZW1zLmZpbmQoZnVuY3Rpb24gKHMpIHsgcmV0dXJuIHMubmFtZSA9PT0gc3lzdGVtTmFtZTsgfSk7XG4gICAgICAgIGlmIChzeXN0ZW0pIHtcbiAgICAgICAgICAgIHN5c3RlbS5vcHRpb25zID0gX19hc3NpZ24oX19hc3NpZ24oe30sIHN5c3RlbS5vcHRpb25zKSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEdhbWVFbmdpbmUucHJvdG90eXBlLmFkZFBpZWNlID0gZnVuY3Rpb24gKHBpZWNlKSB7XG4gICAgICAgIHRoaXMucGllY2VzLnB1c2gocGllY2UpO1xuICAgIH07XG4gICAgR2FtZUVuZ2luZS5wcm90b3R5cGUuaGFuZGxlU2NyZWVuQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSB0eXBlc18xLkdhbWVTdGF0dXMuZ2FtZU92ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gdHlwZXNfMS5HYW1lU3RhdHVzLnBsYXk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zdGF0dXMgPT0gdHlwZXNfMS5HYW1lU3RhdHVzLnBhdXNlKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IHR5cGVzXzEuR2FtZVN0YXR1cy5wbGF5O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc3RhdHVzID09IHR5cGVzXzEuR2FtZVN0YXR1cy5wbGF5KSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IHR5cGVzXzEuR2FtZVN0YXR1cy5wYXVzZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgR2FtZUVuZ2luZS5wcm90b3R5cGUuY2xlYXJDYW52YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjdHggPSB0aGlzLmdhbWUuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5nYW1lLndpZHRoICogdGhpcy5nYW1lLmNlbGxTaXplLCB0aGlzLmdhbWUuaGVpZ2h0ICogdGhpcy5nYW1lLmNlbGxTaXplKTtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMDAwJztcbiAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuZ2FtZS53aWR0aCAqIHRoaXMuZ2FtZS5jZWxsU2l6ZSwgdGhpcy5nYW1lLmhlaWdodCAqIHRoaXMuZ2FtZS5jZWxsU2l6ZSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5nYW1lLndpZHRoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIC8vIHJhbmRvbSBjb2xvcnMgZnJvbSBoaWdobGlnaGNvbG9yc1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLmdhbWUuaGVpZ2h0OyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gY29uc3RhbnRzXzEuaGlnaGxpZ2h0Y29sb3JzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbnN0YW50c18xLmhpZ2hsaWdodGNvbG9ycy5sZW5ndGgpXTtcbiAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoaSAqIHRoaXMuZ2FtZS5jZWxsU2l6ZSwgaiAqIHRoaXMuZ2FtZS5jZWxsU2l6ZSwgMSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEdhbWVFbmdpbmUucHJvdG90eXBlLnVwZGF0ZVJlZnJlc2hUaW1lID0gZnVuY3Rpb24gKHRpbWUpIHtcbiAgICAgICAgdGhpcy5yZWZyZXNoID0gdGltZTtcbiAgICAgICAgaWYgKHRoaXMucmVmcmVzaEhhbmRsZXIpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5yZWZyZXNoSGFuZGxlcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH07XG4gICAgR2FtZUVuZ2luZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PSB0eXBlc18xLkdhbWVTdGF0dXMuZ2FtZU92ZXIpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUmVmcmVzaFRpbWUoUEFVU0VfSU5URVJWQUwpO1xuICAgICAgICAgICAgdGhpcy5jb25maWdTeXN0ZW0oXCJmaXhJdFwiLCB7IGVuYWJsZWQ6IGZhbHNlIH0pO1xuICAgICAgICAgICAgdmFyIGN0eF8xID0gdGhpcy5nYW1lLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgICAgICBjdHhfMS5maWxsU3R5bGUgPSAneWVsbG93JztcbiAgICAgICAgICAgIGN0eF8xLmZvbnQgPSAnMTRweCB0YWhvbWEnO1xuICAgICAgICAgICAgdmFyIG1lc3NhZ2VzID0gW1xuICAgICAgICAgICAgICAgICcgV0VMQ09NRScsXG4gICAgICAgICAgICAgICAgJyAgdGFwIHNjcmVlbidcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBtZXNzYWdlcy5mb3JFYWNoKGZ1bmN0aW9uIChtc2csIGkpIHtcbiAgICAgICAgICAgICAgICBjdHhfMS5maWxsVGV4dChtc2csIChNYXRoLmZsb29yKF90aGlzLmdhbWUud2lkdGggLyAyKSkgKiBfdGhpcy5nYW1lLmNlbGxTaXplIC0gbXNnLmxlbmd0aCAqIDIsIE1hdGguZmxvb3IoX3RoaXMuZ2FtZS5oZWlnaHQgLyAyKSAqIF90aGlzLmdhbWUuY2VsbFNpemUgKyBpICogX3RoaXMuZ2FtZS5jZWxsU2l6ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnN0YXR1cyA9PSB0eXBlc18xLkdhbWVTdGF0dXMucGxheSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVSZWZyZXNoVGltZShQTEFZX0lOVEVSVkFMKTtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnU3lzdGVtKFwiZml4SXRcIiwgeyBlbmFibGVkOiB0cnVlIH0pO1xuICAgICAgICAgICAgdGhpcy5waWVjZXMuZm9yRWFjaChmdW5jdGlvbiAocGllY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWZmZWN0ZWRCeSA9IHBpZWNlLmVmZmVjdGRCeVN5c3RlbXMgfHwgW107XG4gICAgICAgICAgICAgICAgZWZmZWN0ZWRCeS5mb3JFYWNoKGZ1bmN0aW9uIChzeXN0ZW1OYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzeXN0ZW0gPSBfdGhpcy5zeXN0ZW1zLmZpbmQoZnVuY3Rpb24gKHMpIHsgcmV0dXJuIHMubmFtZSA9PT0gc3lzdGVtTmFtZTsgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzeXN0ZW0gJiYgc3lzdGVtLm9wdGlvbnMuZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3lzdGVtLmVmZmVjdHMuYmluZChfdGhpcykocGllY2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcGllY2UucmVkcmF3KF90aGlzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zY29yZS5yZWRyYXcodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zdGF0dXMgPT0gdHlwZXNfMS5HYW1lU3RhdHVzLnBhdXNlKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVJlZnJlc2hUaW1lKFBBVVNFX0lOVEVSVkFMKTtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnU3lzdGVtKFwiZml4SXRcIiwgeyBlbmFibGVkOiBmYWxzZSB9KTtcbiAgICAgICAgICAgIHRoaXMucGllY2VzLmZvckVhY2goZnVuY3Rpb24gKHBpZWNlKSB7XG4gICAgICAgICAgICAgICAgcGllY2UucmVkcmF3KF90aGlzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zY29yZS5yZWRyYXcodGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEdhbWVFbmdpbmUucHJvdG90eXBlLmNyZWF0ZVJhbmRvbVBpZWNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGllY2VzTmFtZXMgPSBPYmplY3Qua2V5cyhwaWVjZXNfMS5kZWZhdWx0KTtcbiAgICAgICAgdmFyIHJhbmRvbVBpZWNlTmFtZSA9IHBpZWNlc05hbWVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBpZWNlc05hbWVzLmxlbmd0aCldO1xuICAgICAgICB2YXIgeCA9IHRoaXMuc3RhdHVzID09IHR5cGVzXzEuR2FtZVN0YXR1cy5wYXVzZSA/IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuZ2FtZS53aWR0aCkgOiBNYXRoLmZsb29yKHRoaXMuZ2FtZS53aWR0aCAvIDIpO1xuICAgICAgICB2YXIgcmFuZG9tUGllY2UgPSBwaWVjZXNfMS5kZWZhdWx0W3JhbmRvbVBpZWNlTmFtZV07XG4gICAgICAgIHZhciByYW5kb21QaWVjZUluc3RhbmNlID0gbmV3IHJhbmRvbVBpZWNlKCk7XG4gICAgICAgIHJhbmRvbVBpZWNlSW5zdGFuY2UuZWZmZWN0ZEJ5U3lzdGVtcyA9IFsnZ3Jhdml0eScsICdmaXhJdCcsICdhZGROZXdQaWVjZScsICdyZXN0YXJ0VGhlR2FtZScsICdrZXlib2FyZCddO1xuICAgICAgICByYW5kb21QaWVjZUluc3RhbmNlLnggPSB4O1xuICAgICAgICByYW5kb21QaWVjZUluc3RhbmNlLnkgPSAwO1xuICAgICAgICByZXR1cm4gcmFuZG9tUGllY2VJbnN0YW5jZTtcbiAgICB9O1xuICAgIEdhbWVFbmdpbmUucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnJlZnJlc2hIYW5kbGVyID0gc2V0SW50ZXJ2YWwodGhpcy51cGRhdGUuYmluZCh0aGlzKSwgdGhpcy5yZWZyZXNoKTtcbiAgICB9O1xuICAgIHJldHVybiBHYW1lRW5naW5lO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IEdhbWVFbmdpbmU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMubGlzdGVuRXZlbnRzID0gdm9pZCAwO1xudmFyIGxpc3RlbkV2ZW50cyA9IGZ1bmN0aW9uIChidG5MZWZ0LCBidG5SaWdodCwgYnRuRmxpcCkge1xuICAgIHZhciBsZWZ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bi1sZWZ0Jyk7XG4gICAgbGVmdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGJ0bkxlZnQoZSk7XG4gICAgfSk7XG4gICAgdmFyIHJpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bi1yaWdodCcpO1xuICAgIHJpZ2h0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgYnRuUmlnaHQoZSk7XG4gICAgfSk7XG4gICAgdmFyIGZsaXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuLWZsaXAnKTtcbiAgICBmbGlwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgYnRuRmxpcChlKTtcbiAgICB9KTtcbn07XG5leHBvcnRzLmxpc3RlbkV2ZW50cyA9IGxpc3RlbkV2ZW50cztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIChwaWVjZSwgd29ybGQpIHtcbiAgICB2YXIgaGl0UGllY2UgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICByZXR1cm4gcGllY2UudGVtcGxhdGUoKS5zb21lKGZ1bmN0aW9uIChyb3csIGopIHtcbiAgICAgICAgICAgIHJldHVybiByb3cuc29tZShmdW5jdGlvbiAoYywgaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjID09PSAxICYmIHBpZWNlLnggKyBpID09PSB4ICYmIHBpZWNlLnkgKyBqID09PSB5O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIHdvcmxkLnNvbWUoZnVuY3Rpb24gKHJvdywgeSkge1xuICAgICAgICByZXR1cm4gcm93LnNvbWUoZnVuY3Rpb24gKGNlbGwsIHgpIHtcbiAgICAgICAgICAgIHJldHVybiBjZWxsICE9PSAwICYmIGhpdFBpZWNlKHgsIHkpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFBpZWNlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBpZWNlKCkge1xuICAgICAgICB0aGlzLnggPSAwO1xuICAgICAgICB0aGlzLnkgPSAwO1xuICAgICAgICB0aGlzLmlkID0gJyc7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gMDtcbiAgICAgICAgdGhpcy5yb3RhdGUgPSAwO1xuICAgICAgICB0aGlzLnRlbXBsYXRlcyA9IFtdO1xuICAgICAgICB0aGlzLmNvbG9yID0gJ3JlZCc7XG4gICAgICAgIHRoaXMuaWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTUpICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDE1KTtcbiAgICB9XG4gICAgUGllY2UucHJvdG90eXBlLmZsaXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucm90YXRlID0gKHRoaXMucm90YXRlICsgMSkgJSB0aGlzLnRlbXBsYXRlcy5sZW5ndGg7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUGllY2UucHJvdG90eXBlLCBcImhlaWdodFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGUoKS5sZW5ndGg7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUGllY2UucHJvdG90eXBlLCBcIndpZHRoXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZSgpWzBdLmxlbmd0aDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIFBpZWNlLnByb3RvdHlwZS5yZWRyYXcgPSBmdW5jdGlvbiAoZW5naW5lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBjdHggPSBlbmdpbmUuZ2FtZS5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSgpLmZvckVhY2goZnVuY3Rpb24gKHJvdywgeSkge1xuICAgICAgICAgICAgcm93LmZvckVhY2goZnVuY3Rpb24gKGNlbGwsIHgpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbCkge1xuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoX3RoaXMueCAqIGVuZ2luZS5nYW1lLmNlbGxTaXplICsgeCAqIGVuZ2luZS5nYW1lLmNlbGxTaXplLCBfdGhpcy55ICogZW5naW5lLmdhbWUuY2VsbFNpemUgKyB5ICogZW5naW5lLmdhbWUuY2VsbFNpemUsIGVuZ2luZS5nYW1lLmNlbGxTaXplLCBlbmdpbmUuZ2FtZS5jZWxsU2l6ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIFBpZWNlO1xufSgpKTtcbnZhciBTUGllY2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFNQaWVjZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTUGllY2UoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmNvbG9yID0gJ2JsdWUnO1xuICAgICAgICBfdGhpcy5zaGFwZSA9ICdzJztcbiAgICAgICAgX3RoaXMuZWZmZWN0ZEJ5U3lzdGVtcyA9IFtdO1xuICAgICAgICBfdGhpcy50ZW1wbGF0ZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLnRlbXBsYXRlc1tfdGhpcy5yb3RhdGVdOyB9O1xuICAgICAgICBfdGhpcy50ZW1wbGF0ZXMgPSBbXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgWzEsIDEsIDBdLFxuICAgICAgICAgICAgICAgIFswLCAxLCAxXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgWzAsIDFdLFxuICAgICAgICAgICAgICAgIFsxLCAxXSxcbiAgICAgICAgICAgICAgICBbMSwgMF0sXG4gICAgICAgICAgICBdXG4gICAgICAgIF07XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIFNQaWVjZTtcbn0oUGllY2UpKTtcbnZhciBPUGllY2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE9QaWVjZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBPUGllY2UoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmNvbG9yID0gJyNGRjE0OTMnO1xuICAgICAgICBfdGhpcy5zaGFwZSA9ICdvJztcbiAgICAgICAgX3RoaXMuZWZmZWN0ZEJ5U3lzdGVtcyA9IFtdO1xuICAgICAgICBfdGhpcy50ZW1wbGF0ZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLnRlbXBsYXRlc1tfdGhpcy5yb3RhdGVdOyB9O1xuICAgICAgICBfdGhpcy50ZW1wbGF0ZXMgPSBbXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgWzEsIDEsIDBdLFxuICAgICAgICAgICAgICAgIFswLCAxLCAxXSxcbiAgICAgICAgICAgICAgICBbMSwgMSwgMF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIFswLCAxLCAwXSxcbiAgICAgICAgICAgICAgICBbMSwgMSwgMV0sXG4gICAgICAgICAgICAgICAgWzEsIDAsIDFdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBbMCwgMSwgMV0sXG4gICAgICAgICAgICAgICAgWzEsIDEsIDBdLFxuICAgICAgICAgICAgICAgIFswLCAxLCAxXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgWzEsIDAsIDFdLFxuICAgICAgICAgICAgICAgIFsxLCAxLCAxXSxcbiAgICAgICAgICAgICAgICBbMCwgMSwgMF0sXG4gICAgICAgICAgICBdXG4gICAgICAgIF07XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIE9QaWVjZTtcbn0oUGllY2UpKTtcbnZhciBTcXVhcmVQaWVjZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU3F1YXJlUGllY2UsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU3F1YXJlUGllY2UoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmNvbG9yID0gJ3llbGxvdyc7XG4gICAgICAgIF90aGlzLnNoYXBlID0gJ3NxdWVyZSc7XG4gICAgICAgIF90aGlzLmVmZmVjdGRCeVN5c3RlbXMgPSBbXTtcbiAgICAgICAgX3RoaXMudGVtcGxhdGUgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBbXG4gICAgICAgICAgICBbMSwgMV0sXG4gICAgICAgICAgICBbMSwgMV0sXG4gICAgICAgIF07IH07XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIFNxdWFyZVBpZWNlO1xufShQaWVjZSkpO1xudmFyIExpbmVQaWVjZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTGluZVBpZWNlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIExpbmVQaWVjZSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuY29sb3IgPSAncmVkJztcbiAgICAgICAgX3RoaXMuc2hhcGUgPSAnbGluZSc7XG4gICAgICAgIF90aGlzLmVmZmVjdGRCeVN5c3RlbXMgPSBbXTtcbiAgICAgICAgX3RoaXMudGVtcGxhdGUgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy50ZW1wbGF0ZXNbX3RoaXMucm90YXRlXTsgfTtcbiAgICAgICAgX3RoaXMudGVtcGxhdGVzID0gW1xuICAgICAgICAgICAgW1sxLCAxLCAxLCAxXV0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgWzFdLFxuICAgICAgICAgICAgICAgIFsxXSxcbiAgICAgICAgICAgICAgICBbMV0sXG4gICAgICAgICAgICAgICAgWzFdXG4gICAgICAgICAgICBdXG4gICAgICAgIF07XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIExpbmVQaWVjZTtcbn0oUGllY2UpKTtcbnZhciBwaWVjZXMgPSB7XG4gICAgUzogU1BpZWNlLFxuICAgIExpbmU6IExpbmVQaWVjZSxcbiAgICBTcXVhcmU6IFNxdWFyZVBpZWNlLFxuICAgIE86IE9QaWVjZVxufTtcbmV4cG9ydHMuZGVmYXVsdCA9IHBpZWNlcztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gZGVmYXVsdF8xKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IFwiZml4SXRcIixcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgaW50ZXJ2YWw6IDEwMDAsXG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIGVmZmVjdHM6IGZ1bmN0aW9uIChwaWVjZSkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKHBpZWNlLnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NvcmUudmFsdWUgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgcGllY2UuZWZmZWN0ZEJ5U3lzdGVtcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAvLyByYW5kb20gY29sb3IgY2hhbmdlIGZyb20gaGlnaHRsaWdodGNvbG9yc1xuICAgICAgICAgICAgICAgICAgICBwaWVjZS5jb2xvciA9ICcjY2NjJztcbiAgICAgICAgICAgICAgICAgICAgcGllY2UudGVtcGxhdGUoKS5mb3JFYWNoKGZ1bmN0aW9uIChyb3csIHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdy5mb3JFYWNoKGZ1bmN0aW9uIChjZWxsLCB4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGwgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMud29ybGRbcGllY2UueSArIHldW3BpZWNlLnggKyB4XSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7IH1cbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLmRlZmF1bHQgPSBkZWZhdWx0XzE7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIGRlZmF1bHRfMSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBcImZsaXBlclwiLFxuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBpbnRlcnZhbDogMTAwMCxcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgZWZmZWN0czogZnVuY3Rpb24gKHBpZWNlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHBpZWNlLmZsaXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7IH1cbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLmRlZmF1bHQgPSBkZWZhdWx0XzE7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdyYXZpdHkgPSB2b2lkIDA7XG52YXIgaW50ZXJzZWN0aW9uXzEgPSByZXF1aXJlKFwiLi4vaW50ZXJzZWN0aW9uXCIpO1xudmFyIGdyYXZpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogXCJncmF2aXR5XCIsXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGludGVydmFsOiAxMDAwLFxuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBlZmZlY3RzOiBmdW5jdGlvbiAocGllY2UpIHtcbiAgICAgICAgICAgIGlmIChwaWVjZS55ICsgcGllY2UuaGVpZ2h0IDwgdGhpcy5nYW1lLmhlaWdodCAmJiAhKDAsIGludGVyc2VjdGlvbl8xLmRlZmF1bHQpKF9fYXNzaWduKF9fYXNzaWduKHt9LCBwaWVjZSksIHsgeTogcGllY2UueSArIDEgfSksIHRoaXMud29ybGQpKSB7XG4gICAgICAgICAgICAgICAgcGllY2UueSArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGllY2Uuc3RhdHVzID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9O1xufTtcbmV4cG9ydHMuZ3Jhdml0eSA9IGdyYXZpdHk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgZXZlbnRzXzEgPSByZXF1aXJlKFwiLi4vZXZlbnRzXCIpO1xudmFyIGludGVyc2VjdGlvbl8xID0gcmVxdWlyZShcIi4uL2ludGVyc2VjdGlvblwiKTtcbmZ1bmN0aW9uIGRlZmF1bHRfMSgpIHtcbiAgICB2YXIgbGFzdEV2ZW50ID0gbnVsbDtcbiAgICAoMCwgZXZlbnRzXzEubGlzdGVuRXZlbnRzKShcbiAgICAvLyBsZWZ0XG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgICBsYXN0RXZlbnQgPSAnbGVmdCc7XG4gICAgfSwgXG4gICAgLy8gcmlnaHRcbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxhc3RFdmVudCA9ICdyaWdodCc7XG4gICAgfSwgXG4gICAgLy8gZmxpcFxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGFzdEV2ZW50ID0gJ2ZsaXAnO1xuICAgIH0pO1xuICAgIHZhciBidG5MZWZ0ID0gZnVuY3Rpb24gKHBpZWNlKSB7XG4gICAgICAgIGlmIChwaWVjZS54ID4gMFxuICAgICAgICAgICAgJiYgISgwLCBpbnRlcnNlY3Rpb25fMS5kZWZhdWx0KShfX2Fzc2lnbihfX2Fzc2lnbih7fSwgcGllY2UpLCB7IHg6IHBpZWNlLnggLSAxIH0pLCB0aGlzLndvcmxkKSkge1xuICAgICAgICAgICAgcGllY2UueCAtPSAxO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB2YXIgYnRuUmlnaHQgPSBmdW5jdGlvbiAocGllY2UpIHtcbiAgICAgICAgaWYgKHBpZWNlLnggPCB0aGlzLmdhbWUud2lkdGggLSBwaWVjZS53aWR0aFxuICAgICAgICAgICAgJiYgISgwLCBpbnRlcnNlY3Rpb25fMS5kZWZhdWx0KShfX2Fzc2lnbihfX2Fzc2lnbih7fSwgcGllY2UpLCB7IHg6IHBpZWNlLnggKyAxIH0pLCB0aGlzLndvcmxkKSkge1xuICAgICAgICAgICAgcGllY2UueCArPSAxO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB2YXIgYnRuRmxpcCA9IGZ1bmN0aW9uIChwaWVjZSkge1xuICAgICAgICBwaWVjZS5mbGlwKCk7XG4gICAgfTtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBcImtleWJvYXJkXCIsXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGludGVydmFsOiAxMDAwLFxuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBlZmZlY3RzOiBmdW5jdGlvbiAocGllY2UpIHtcbiAgICAgICAgICAgIGlmIChwaWVjZS5zdGF0dXMgPT09IDAgJiYgbGFzdEV2ZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChsYXN0RXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBidG5MZWZ0LmJpbmQodGhpcykocGllY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ0blJpZ2h0LmJpbmQodGhpcykocGllY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2ZsaXAnOlxuICAgICAgICAgICAgICAgICAgICAgICAgYnRuRmxpcC5iaW5kKHRoaXMpKHBpZWNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxhc3RFdmVudCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gZGVmYXVsdF8xO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBkZWZhdWx0XzEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogXCJhZGROZXdQaWVjZVwiLFxuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBpbnRlcnZhbDogMTAwMCxcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgZWZmZWN0czogZnVuY3Rpb24gKHBpZWNlKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucGllY2VzLmZpbmQoZnVuY3Rpb24gKHApIHsgcmV0dXJuIHAuc3RhdHVzID09PSAwOyB9KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkUGllY2UodGhpcy5jcmVhdGVSYW5kb21QaWVjZSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLmRlZmF1bHQgPSBkZWZhdWx0XzE7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5mdW5jdGlvbiBkZWZhdWx0XzEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogXCJyZXN0YXJ0VGhlR2FtZVwiLFxuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBpbnRlcnZhbDogMTAwMCxcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgZWZmZWN0czogZnVuY3Rpb24gKHBpZWNlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy53b3JsZFswXS5zb21lKGZ1bmN0aW9uIChjZWxsKSB7IHJldHVybiBjZWxsID09PSAxOyB9KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NvcmUudmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMucGllY2VzID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoY29uc3RhbnRzXzEuZ3JpZCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkUGllY2UodGhpcy5jcmVhdGVSYW5kb21QaWVjZSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLmRlZmF1bHQgPSBkZWZhdWx0XzE7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuR2FtZVN0YXR1cyA9IHZvaWQgMDtcbnZhciBHYW1lU3RhdHVzO1xuKGZ1bmN0aW9uIChHYW1lU3RhdHVzKSB7XG4gICAgR2FtZVN0YXR1c1tHYW1lU3RhdHVzW1wiaW5pdFwiXSA9IDBdID0gXCJpbml0XCI7XG4gICAgR2FtZVN0YXR1c1tHYW1lU3RhdHVzW1wicGF1c2VcIl0gPSAxXSA9IFwicGF1c2VcIjtcbiAgICBHYW1lU3RhdHVzW0dhbWVTdGF0dXNbXCJwbGF5XCJdID0gMl0gPSBcInBsYXlcIjtcbiAgICBHYW1lU3RhdHVzW0dhbWVTdGF0dXNbXCJnYW1lT3ZlclwiXSA9IDNdID0gXCJnYW1lT3ZlclwiO1xufSkoR2FtZVN0YXR1cyA9IGV4cG9ydHMuR2FtZVN0YXR1cyB8fCAoZXhwb3J0cy5HYW1lU3RhdHVzID0ge30pKTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBlbmdpbmVfMSA9IHJlcXVpcmUoXCIuL2VuZ2luZVwiKTtcbnZhciBmaXhfaXRfMSA9IHJlcXVpcmUoXCIuL3N5c3RlbXMvZml4LWl0XCIpO1xudmFyIGZsaXBlcl8xID0gcmVxdWlyZShcIi4vc3lzdGVtcy9mbGlwZXJcIik7XG52YXIgZ3Jhdml0eV8xID0gcmVxdWlyZShcIi4vc3lzdGVtcy9ncmF2aXR5XCIpO1xudmFyIGtleWJvYXJkXzEgPSByZXF1aXJlKFwiLi9zeXN0ZW1zL2tleWJvYXJkXCIpO1xudmFyIHBpZWNlX2dlbmVyYXRvcl8xID0gcmVxdWlyZShcIi4vc3lzdGVtcy9waWVjZS1nZW5lcmF0b3JcIik7XG52YXIgcmVzdGFydF90aGVfZ2FtZV8xID0gcmVxdWlyZShcIi4vc3lzdGVtcy9yZXN0YXJ0LXRoZS1nYW1lXCIpO1xudmFyIGNhbnZhc0VsZW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY3JlZW5cIik7XG52YXIgZ2FtZUVuZ2luZSA9IG5ldyBlbmdpbmVfMS5kZWZhdWx0KGNhbnZhc0VsZW1lbnQpO1xuZ2FtZUVuZ2luZS5hZGRTeXN0ZW0oKDAsIGdyYXZpdHlfMS5ncmF2aXR5KSgpKTtcbmdhbWVFbmdpbmUuYWRkU3lzdGVtKCgwLCBmaXhfaXRfMS5kZWZhdWx0KSgpKTtcbmdhbWVFbmdpbmUuYWRkU3lzdGVtKCgwLCBmbGlwZXJfMS5kZWZhdWx0KSgpKTtcbmdhbWVFbmdpbmUuYWRkU3lzdGVtKCgwLCBwaWVjZV9nZW5lcmF0b3JfMS5kZWZhdWx0KSgpKTtcbmdhbWVFbmdpbmUuYWRkU3lzdGVtKCgwLCByZXN0YXJ0X3RoZV9nYW1lXzEuZGVmYXVsdCkoKSk7XG5nYW1lRW5naW5lLmFkZFN5c3RlbSgoMCwga2V5Ym9hcmRfMS5kZWZhdWx0KSgpKTtcbmdhbWVFbmdpbmUuYWRkUGllY2UoZ2FtZUVuZ2luZS5jcmVhdGVSYW5kb21QaWVjZSgpKTtcbmdhbWVFbmdpbmUuc3RhcnQoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==