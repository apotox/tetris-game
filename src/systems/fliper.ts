import { gameSystemType } from "../types"

export default function (): gameSystemType {
    return {
        name: "fliper",
        options: {
            interval: 1000,
            enabled: true
        },
        effects: function (piece) {
            try {
                piece.flip()
            } catch (e) { }
        }
    }
}