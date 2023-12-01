export interface AudioNodeElement {
    audioCtx: AudioContext;
    gainNode: GainNode;
    initNode(): void;
    connectNode(): void;
    disconnectNode(): void;
    resetParam(): void;
}
