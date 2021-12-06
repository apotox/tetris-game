import intersection from "../intersection";
import { gameSystemType } from "../types";




export const gravity = function (): gameSystemType {
    return {
        name: "gravity",
        interval: 0,
        effects: function (piece) {
            if (piece.y + piece.height < this.game.height && !intersection({ ...piece, y: piece.y + 1 }, this.world)) {
                piece.y += 1;
            } else {
                piece.status = 1;
            }
        },
    };
}