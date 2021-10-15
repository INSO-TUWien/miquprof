import { Observable, PartialObserver } from "rxjs";

export class Pipeline<T> {
    private pipeline: Observable<any>;
    constructor(previous: Observable<T>) {
        this.pipeline = previous;
    }

    public static start<A>(fn: () => Observable<A>) {
        return new Pipeline(fn());
    }

    public next<A>(fn: (o: Observable<T>) => Observable<A>) {
        return new Pipeline(fn(this.pipeline));
    }

    // public nextWithOutput<A>(nextFn: (c: C, r: R, o: Observable<T>) => Observable<A>, outputFn: (o: Observable<T>) => void) {
    //     this.output(outputFn);
    //     return this.next(nextFn);
    // }

    public nextSplit<A>(nextFn: (o: Observable<T>) => Observable<A>, outputFn: PartialObserver<T>) {
        this.output(outputFn);
        return this.next(nextFn);
    }

    public output(fn: PartialObserver<T>) {
        this.pipeline.subscribe(fn);
    }
}

// export function combinePipelines<A, B, C>(config: A, remote: B, a: PipelineStep<A, B, C>, b: PipelineStep<A, B, C>) {
//     const observable = new Observable(subscriber => {
//         a.output(subscriber);
//         b.output(subscriber);
//     });
//     return new PipelineStep(config, remote, observable);
// }

