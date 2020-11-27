import {IConfigGithubOctokit} from "../adapters/githubOctokit/config/IConfigGithubOctokit";
import {Cursor} from "../../../models/Cursor";

export async function combineFetch(config: IConfigGithubOctokit,subscriber: any, functionToCall: (config: IConfigGithubOctokit, cursor: Cursor) => Promise<[any[], Cursor]>): Promise<void> {
    let [data, cursor] = await functionToCall(config, new Cursor('', true));
    subscriber.next(data);
    while (cursor.hasNextPage) {
        const result = await functionToCall(config, cursor);
        data = result[0];
        cursor = result[1];
        subscriber.next(data);
    }
    subscriber.complete();
}
