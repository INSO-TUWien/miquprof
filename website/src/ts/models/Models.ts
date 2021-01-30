// TODO: split this into multiple files

export interface Branch {
    name:string,
    history: Commit[],
    id: string,
    protected: boolean
}

export interface Commit {
    message: string | undefined,
    id: string,
    tree: CommitTree | undefined,
    files: any | undefined
  }
  
export interface CommitTree {
    id: string,
    files: TreeFile[] | undefined // todo: change typing
}

export interface TreeFile {
    id: string | undefined,
    filename: string | undefined,
    additions: number | undefined,
    deletions: number | undefined,
    changes: number | undefined,
    status: string | undefined
}

export interface Issue {
    id: number,
    number: number,
    title: string,
    comments: number,
    updated_at: string,
    labels: string[]
}

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
