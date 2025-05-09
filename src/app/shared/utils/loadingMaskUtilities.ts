export const LOADING_MASK_UTIL = {
    currentlyLoading: 0,
    lastChanged: new Date(),

    isLoading(): boolean {
        return this.currentlyLoading > 0;
    },

    increase(): void {
        this.currentlyLoading++;
    },

    decrease(): void {
        this.currentlyLoading--;
    }
}