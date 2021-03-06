import { gameSystemType } from "../types"

export default function (): gameSystemType {
    return {
        name: "fixIt",
        options: {
            interval: 1000,
            enabled: true
        },
        effects: function (piece) {
            try {
                if (piece.status == 1) {
                    this.score.value += 1
                    piece.effectdBySystems = []
                    // random color change from hightlightcolors
                    piece.color = '#ccc'

                    piece.template().forEach((row, y) => {
                        row.forEach((cell, x) => {
                            if (cell === 1) {
                                this.world[piece.y + y][piece.x + x] = 1;
                            }
                        })
                    })

                }
            } catch (e) { }
        }
    }
}