import { Octokit } from "@octokit/rest";
import { Observable } from "rxjs/internal/Observable";
import { IConfigGithubOctokit } from "./config/IConfigGithubOctokit";

export interface Workflow {
    id: number,
    state: string,
    name: string,
    path: string,
    workflowRuns: WorkflowRun[]
}

export interface WorkflowRun {
    id: number,
    name: string,
    status: string,
    event: string,
    commit_id: string
}
  
export class ActionAdapter {
    private config: IConfigGithubOctokit;
    private octokit: Octokit;

    constructor(config: IConfigGithubOctokit, octokit: Octokit) {
        this.config = config;
        this.octokit = octokit;
    }

    public async fetch(): Promise<Workflow[]> {
        const workflows = await this.fetchWorkflows();
        return await this.fetchActions(workflows);
        
    }

    private async fetchWorkflows (): Promise<Workflow[]> {
        let workflows: Workflow[] = [];
        let page = 1;
        let running = true;
        const fetchPerPage = 10;
        do {
            const res = await this.octokit.actions.listRepoWorkflows({
            owner: this.config.owner,
            repo: this.config.repo,
            per_page: fetchPerPage,
            page: page++
            });
            this.checkOctokitResult(res);
            running = res.data.workflows.length === fetchPerPage;
            res.data.workflows.forEach(workflow => workflows.push({
                id: workflow.id,
                state: workflow.state,
                name: workflow.name,
                path: workflow.path,
                workflowRuns: []
            } as Workflow));
        } while(running);
        return workflows;
    }
    
    private async fetchActions(workflows: Workflow[]) {
        return await Promise.all(workflows.map(async workflow => {
            let page = 1;
            let running = true;
            const fetchPerPage = 10;
            do {
                const res = await this.octokit.actions.listWorkflowRuns({
                owner: this.config.owner,
                repo: this.config.repo,
                workflow_id: workflow.id,
                per_page: fetchPerPage,
                page: page++
                });
                this.checkOctokitResult(res);
                running = res.data.workflow_runs.length === fetchPerPage;
                workflow.workflowRuns.push(...res.data.workflow_runs.map(run => { 
                    return {
                        id: run.id,
                        name: run.name,
                        status: run.status,
                        event: run.event,
                        commit_id: run.head_commit?.id ?? ''
                    } as WorkflowRun }));
            } while(running);
            return workflow;
        }));
    }


  private checkOctokitResult(res: any) {
    if (res.status !== 200) {
        throw new Error('fetch actions did not return successfully!');
    }
    if (res.data === undefined) {
      throw new Error('data is undefined!');
    }
  }
}
  