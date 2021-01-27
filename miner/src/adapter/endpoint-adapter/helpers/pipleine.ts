import { Observable, PartialObserver } from "rxjs";

export class Pipeline<C, R, T> {
    private config: C;
    private remote: R;
    private pipeline: PipelineStep<C, R, T> | undefined;
    constructor(config: C, remote: R) {
        this.config = config;
        this.remote = remote;
    }

    public start(fn: (c: C, r: R) => Observable<T>) {
        this.pipeline = new PipelineStep(this.config, this.remote, fn(this.config, this.remote));
        return this.pipeline;
    }

}

export class PipelineStep<C, R, T> {
    private config: C;
    private remote: R
    private pipeline: Observable<T>;
    constructor(config: C, remote: R, previous: Observable<T>) {
        this.config = config;
        this.pipeline = previous;
        this.remote = remote;
    }

    public then(fn: (c: C, r: R, o: Observable<T>) => Observable<T>) {
        return new PipelineStep(this.config, this.remote,  fn(this.config, this.remote, this.pipeline));
    }

    public output(observer: PartialObserver<T>) {
        this.pipeline.subscribe(observer);
    }
}

export function combinePipelines<A, B, C>(config: A, remote: B, a: PipelineStep<A, B, C>, b: PipelineStep<A, B, C>) {
    const observable = new Observable(subscriber => {
        a.output(subscriber);
        b.output(subscriber);
    });
    return new PipelineStep(config, remote, observable);
}

