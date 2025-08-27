export class ArchiveManager {
    constructor() {
        this._localGameStatus = null;
    }

    get LocalGameStatus() {
        if (this._localGameStatus !== null) {
            return this._localGameStatus;
        }

        const s = localStorage.getItem("GameStatus");
        try {
            this._localGameStatus = s ? JSON.parse(s) : null;
        } catch (e) {
            console.error("parse archive error:", e);
            this._localGameStatus = null;
        }

        return this._localGameStatus;
    }

    set LocalGameStatus(value) {
        this._localGameStatus = value;
        const s = JSON.stringify(this._localGameStatus);
        localStorage.setItem("GameStatus", s);
    }
}