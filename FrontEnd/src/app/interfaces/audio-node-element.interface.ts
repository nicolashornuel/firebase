export interface AudioNodeElement {
    audioCtx: AudioContext;
    gainNode: GainNode;
    connectNode(): void;
    disconnectNode(): void;
    resetParam(): void;

}
