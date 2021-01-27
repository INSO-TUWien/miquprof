import { sub } from "args";
import { Observable, Subscriber, TeardownLogic } from "rxjs";
import { Branch } from "./BranchAdapter";

export function createBranchObservable (cb: (branches: Branch[], subscriber: Subscriber<Branch[]>) => Promise<Branch[]>, pipeline: Observable<Branch[]>) {
    return new Observable<Branch[]>(subscriber => {
        const observer = {
          next: (data: Branch[]) => {
              cb(data, subscriber)
              .then(branch => subscriber.next(branch));
          },
          error: subscriber.error,
        };
        pipeline.subscribe(observer);
    });
}