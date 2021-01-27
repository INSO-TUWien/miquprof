import { Observable, Observer, PartialObserver } from "rxjs";

export class Pipeline<C, T> {
    private config: C;
    private pipeline: PipelineStep<C, T> | undefined;
    constructor(config: C) {
        this.config = config;
    }

    public start(fn: (c: C) => Observable<T>) {
        this.pipeline = new PipelineStep(this.config, fn(this.config));
        return this.pipeline;
    }

}

export class PipelineStep<C, T> {
    private config: C;
    private pipeline: Observable<T>;
    constructor(config: C, previous: Observable<T>) {
        this.config = config;
        this.pipeline = previous;
    }

    public then(fn: (c: C, o: Observable<T>) => Observable<T>) {
        return new PipelineStep(this.config, fn(this.config, this.pipeline));
    }

    public async output(observer: PartialObserver<T>) {
        this.pipeline.subscribe(observer);
    }
}

