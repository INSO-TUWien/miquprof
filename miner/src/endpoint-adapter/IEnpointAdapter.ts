import {Observable} from "rxjs";
import {Issue} from "../models/Issue";

export interface IEndpointAdapter {
    fetchIssues:(config:any)=>Observable<[Issue]>,
}