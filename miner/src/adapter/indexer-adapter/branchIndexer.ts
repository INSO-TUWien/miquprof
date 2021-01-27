import { Observable } from "rxjs";
import { Branch } from "../endpoint-adapter/adapters/githubOctokit/BranchAdapter";

export  function indexBranches (pipeline: Observable<Branch[]>) {
    return new Observable(subscriber => {
        let branchIds: string[] = [];
        const observer = {
            next: (branches: Branch[]) => {
                const newIds = branches
                    .filter(branch => !branchIds.includes(branch.sha))
                    .map(branch => branch.sha);
                branchIds = branchIds.concat(newIds);
                subscriber.next(newIds);
            },
            error: subscriber.error
        }
        pipeline.subscribe(observer);
    });
}