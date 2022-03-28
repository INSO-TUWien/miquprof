// TODO: fix typing
export function checkOctokitResult(res: any) {
    if (res.status !== 200) {
        return true;
    }
    if (res.data === undefined) {
        return true;
    }
    return false;
}