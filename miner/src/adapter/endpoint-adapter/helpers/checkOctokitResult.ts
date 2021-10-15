// TODO: fix typing
export function checkOctokitResult(res: any, subscriber: any) {
    if (res.status !== 200) {
        subscriber.error('fetch commits did not return successfully!');
        return true;
    }
    if (res.data === undefined) {
        subscriber.error('data is undefined!');
        return true;
    }
    return false;
}