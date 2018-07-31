import { Dispatcher } from 'flux';
import { Event } from '../dispatcher/MapEditorDispatcher';

import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

class FluxStore<TState> {

    public dispatchToken: string;

    protected changed: boolean;
    protected emitter: EventEmitter;
    protected dispatcher: Dispatcher<Event>;
    protected cleanStateFn: () => TState;
    protected state: TState;



    constructor(dispatcher: Dispatcher<Event>, protected onDispatch: (action: Event) => void, cleanStateFn: () => TState) {
        this.emitter = new EventEmitter();
        this.changed = false;
        this.dispatcher = dispatcher;
        this.dispatchToken = dispatcher.register((payload: Event) => {
            this.invokeOnDispatch(payload);
        });

        this.cleanStateFn = cleanStateFn;
        this.state = this.cleanStateFn();
    }

    /**
     * Is idempotent per dispatched event
     */
    public emitChange() {
        this.changed = true;
    }

    public hasChanged() { return this.changed; }

    public addChangeListener(callback: () => void) {
        this.emitter.on(CHANGE_EVENT, callback);
    }

    public removeChangeListener(callback: () => void) {
        this.emitter.removeListener(CHANGE_EVENT, callback);
    }

    public cleanState() {
        this.changed = false;
        this.state = this.cleanStateFn();
    }

    public invokeOnDispatch(payload: Event) {
        this.changed = false;
        this.onDispatch(payload);
        if (this.changed) {
            this.emitter.emit(CHANGE_EVENT);
        }
    }
}

export default FluxStore;