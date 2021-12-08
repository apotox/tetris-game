import { gamePieceType, GameStatus, gameSystemType } from "./types";
import pieces from './pieces';
import { grid, highlightcolors } from "./constants";
import Score from "./Score";

const PLAY_INTERVAL = 400;
const PAUSE_INTERVAL = 40;

export default class GameEngine {
    pieces: gamePieceType[] = []
    systems: gameSystemType[] = []
    refresh: number = PAUSE_INTERVAL;
    refreshHandler: any = null;

    world: number[][] = []
    score: Score = null

    status: GameStatus = GameStatus.gameOver

    game = {
        canvas: null,
        height: grid.length,
        width: grid[0].length,
        cellSize: 20,
    }

    addSystem(system: gameSystemType) {
        this.systems.push(system)
    }

    configSystem(systemName: string, options){
        const system = this.systems.find(s => s.name === systemName)
        if(system){
            system.options = {
                ...system.options,
                ...options
            }
        }
    }

    addPiece(piece: gamePieceType) {
        this.pieces.push(piece)
    }

    constructor(canvasElement: HTMLCanvasElement) {
        console.log('game engine created');
        this.game.canvas = canvasElement
        this.world = JSON.parse(JSON.stringify(grid))

        this.score = new Score()

        const body = document.getElementsByTagName('body')[0]
        body.addEventListener('click', this.handleScreenClick.bind(this))
    }

    private handleScreenClick() {

        if (this.status == GameStatus.gameOver) {
            this.status = GameStatus.play
        } else if (this.status == GameStatus.pause) {
            this.status = GameStatus.play
        } else if (this.status == GameStatus.play) {
            this.status = GameStatus.pause
        }

    }

    private clearCanvas() {
        const ctx = this.game.canvas.getContext('2d');

        ctx.clearRect(0, 0, this.game.width * this.game.cellSize, this.game.height * this.game.cellSize)
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, this.game.width * this.game.cellSize, this.game.height * this.game.cellSize)

        for (let i = 0; i < this.game.width; i += 1) {
            // random colors from highlighcolors

            for (let j = 0; j < this.game.height; j += 1) {
                ctx.fillStyle = highlightcolors[Math.floor(Math.random() * highlightcolors.length)]
                ctx.fillRect(i * this.game.cellSize, j * this.game.cellSize, 1, 1)
            }
        }
    }

    updateRefreshTime(time: number) {
        this.refresh = time
        if(this.refreshHandler){
            clearInterval(this.refreshHandler)
        }
        this.start()
    }


    private update() {
        this.clearCanvas()

        if (this.status == GameStatus.gameOver) {
            this.updateRefreshTime(PAUSE_INTERVAL)
            this.configSystem("fixIt", { enabled: false })
            let ctx = this.game.canvas.getContext("2d") as CanvasRenderingContext2D;
            ctx.fillStyle = 'yellow'
            ctx.font = '14px tahoma';
            const messages = [
                ' WELCOME',
                '  tap screen'
            ]

            messages.forEach((msg, i) => {
                ctx.fillText(msg, (Math.floor(this.game.width / 2)) * this.game.cellSize - msg.length * 2, Math.floor(this.game.height / 2) * this.game.cellSize + i * this.game.cellSize);
            })


        } else if (this.status == GameStatus.play) {
            this.updateRefreshTime(PLAY_INTERVAL)
            this.configSystem("fixIt", { enabled: true })
            this.pieces.forEach(piece => {

                const effectedBy = piece.effectdBySystems || []
                effectedBy.forEach(systemName => {
                    const system = this.systems.find(s => s.name === systemName)
                    if (system && system.options.enabled) {
                        system.effects.bind(this)(piece)
                    }
                })
                piece.redraw(this)

            })

            this.score.redraw(this)
        }else if (this.status == GameStatus.pause) {
            this.updateRefreshTime(PAUSE_INTERVAL)
            this.configSystem("fixIt", { enabled: false })
            this.pieces.forEach(piece => {
                piece.redraw(this)

            })

            this.score.redraw(this)
        }


    }



    public createRandomPiece() {
        const piecesNames = Object.keys(pieces)
        const randomPieceName = piecesNames[Math.floor(Math.random() * piecesNames.length)]
        const x = this.status == GameStatus.pause ? Math.floor(Math.random() * this.game.width) : Math.floor(this.game.width / 2)
        
        const randomPiece = pieces[randomPieceName]
        const randomPieceInstance = new randomPiece()
        randomPieceInstance.effectdBySystems = ['gravity', 'fixIt', 'addNewPiece', 'restartTheGame', 'keyboard']
        randomPieceInstance.x = x
        randomPieceInstance.y = 0
        return randomPieceInstance
    }


    public start() {
        this.refreshHandler = setInterval(this.update.bind(this), this.refresh)
    }
}