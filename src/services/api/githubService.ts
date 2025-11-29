import axios, { AxiosInstance, AxiosError } from 'axios';

// --- Configuration and Environment Variables ---
const GITHUB_API_BASE_URL = 'https://api.github.com';

// --- Type Definitions for GitHub API Responses (simplified for common use cases) ---

/**
 * Represents a GitHub User object.
 */
export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username?: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a GitHub Repository object.
 */
export interface GitHubRepository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: GitHubUser;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
  forks_count: number;
  mirror_url: string | null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
    node_id: string;
  } | null;
  allow_forking: boolean;
  is_template: boolean;
  web_commit_signoff_required: boolean;
  topics: string[];
  visibility: 'public' | 'private' | 'internal';
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
  temp_clone_token?: string;
  network_count: number;
  subscribers_count: number;
}

/**
 * Represents a GitHub Commit object.
 */
export interface GitHubCommit {
  sha: string;
  node_id: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    tree: {
      sha: string;
      url: string;
    };
    url: string;
    comment_count: number;
    verification: {
      verified: boolean;
      reason: string;
      signature: string | null;
      payload: string | null;
    };
  };
  url: string;
  html_url: string;
  comments_url: string;
  author: GitHubUser | null; // Can be null if author is not a GitHub user
  committer: GitHubUser | null; // Can be null if committer is not a GitHub user
  parents: Array<{
    sha: string;
    url: string;
    html_url: string;
  }>;
}

/**
 * Represents a GitHub Pull Request object.
 */
export interface GitHubPullRequest {
  url: string;
  id: number;
  node_id: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  issue_url: string;
  number: number;
  state: 'open' | 'closed';
  locked: boolean;
  title: string;
  user: GitHubUser;
  body: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  merge_commit_sha: string | null;
  assignee: GitHubUser | null;
  assignees: GitHubUser[];
  requested_reviewers: GitHubUser[];
  requested_teams: any[]; // Simplified, can be more specific
  labels: Array<{
    id: number;
    node_id: string;
    url: string;
    name: string;
    color: string;
    default: boolean;
    description: string | null;
  }>;
  milestone: any | null; // Simplified
  draft: boolean;
  commits_url: string;
  review_comments_url: string;
  review_comment_url: string;
  comments_url: string;
  statuses_url: string;
  head: {
    label: string;
    ref: string;
    sha: string;
    user: GitHubUser;
    repo: GitHubRepository;
  };
  base: {
    label: string;
    ref: string;
    sha: string;
    user: GitHubUser;
    repo: GitHubRepository;
  };
  _links: any; // Simplified
  author_association: string;
  auto_merge: any | null; // Simplified
  active_lock_reason: string | null;
  merged: boolean;
  mergeable: boolean | null;
  rebaseable: boolean | null;
  mergeable_state: string;
  merged_by: GitHubUser | null;
  comments: number;
  review_comments: number;
  maintainer_can_modify: boolean;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
}

/**
 * Represents a GitHub Actions Workflow Run object.
 */
export interface GitHubWorkflowRun {
  id: number;
  name: string | null;
  node_id: string;
  head_branch: string;
  head_sha: string;
  run_number: number;
  event: string;
  status: 'queued' | 'in_progress' | 'completed' | 'waiting' | 'requested' | 'pending';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  workflow_id: number;
  check_suite_id: number;
  check_suite_node_id: string;
  url: string;
  html_url: string;
  pull_requests: GitHubPullRequest[];
  created_at: string;
  updated_at: string;
  actor: GitHubUser;
  triggering_actor: GitHubUser;
  jobs_url: string;
  logs_url: string;
  check_suite_url: string;
  artifacts_url: string;
  cancel_url: string;
  rerun_url: string;
  workflow_url: string;
  repository: GitHubRepository;
  head_repository: GitHubRepository;
}

// --- GitHub API Service Class ---

/**
 * A dedicated service for interacting with the GitHub API.
 * It handles authentication and provides methods for fetching repository data,
 * commits, pull requests, and GitHub Actions workflow statuses.
 *
 * Authentication:
 * The GitHub Personal Access Token (PAT) or OAuth token should be provided
 * securely, typically from a UI input slot, environment variable, or a secure
 * client-side storage mechanism. This service expects the token to be passed
 * during initialization or with each request.
 *
 * Security Enhancements (Conceptual Integration):
 * - Point-to-Point Encryption (P2P): The underlying `axios` instance could be
 *   configured with interceptors that encrypt/decrypt payloads using a shared
 *   secret established via a secure key exchange. For GitHub's HTTPS, TLS
 *   already provides P2P encryption. If custom P2P encryption were needed for
 *   the *content* of requests/responses, it would be implemented at a layer
 *   above standard HTTP, e.g., encrypting the request body before sending.
 * - Homomorphic Encryption: This is typically used for computations on encrypted
 *   data without decrypting it. It's not directly applicable to standard API
 *   calls where the server needs to process unencrypted data. If specific
 *   sensitive data from GitHub needed homomorphic processing, it would involve
 *   a dedicated homomorphic encryption service that this module would interact
 *   with *after* fetching data, or before sending highly sensitive data.
 * - Kyber/Dilithium: These are Post-Quantum Cryptography (PQC) algorithms for
 *   key exchange (Kyber) and digital signatures (Dilithium). They would be
 *   integrated at the TLS handshake level or within a custom secure channel
 *   protocol to establish a quantum-resistant secure connection, not directly
 *   within the application-level API calls. This would require a custom HTTP
 *   client or OS-level network stack modifications.
 *
 * For this service, we assume standard HTTPS provides sufficient transport
 * security, and any advanced encryption would be handled by a lower-level
 * `secureHttpClient` or `encryptionService` that wraps or intercepts `axios` calls.
 */
export class GitHubService {
  private api: AxiosInstance;
  private githubToken: string | null = null;

  constructor(token?: string) {
    this.api = axios.create({
      baseURL: GITHUB_API_BASE_URL,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (token) {
      this.setAuthToken(token);
    }

    // Axios Interceptor for dynamic token injection and error handling
    this.api.interceptors.request.use(
      (config) => {
        if (this.githubToken) {
          config.headers.Authorization = `token ${this.githubToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          console.error(`GitHub API Error: ${error.response.status}`, error.response.data);
          // Specific error handling for 401, 403, 404, etc.
          if (error.response.status === 401 || error.response.status === 403) {
            // Token expired or invalid. Trigger re-authentication flow in UI.
            console.warn('GitHub token invalid or expired. Please re-authenticate.');
            // In a real app, you might dispatch an event or throw a custom error
            // that the UI layer can catch to prompt for re-authentication.
          }
        } else if (error.request) {
          console.error('GitHub API No Response:', error.request);
        } else {
          console.error('GitHub API Request Setup Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Sets the GitHub Personal Access Token (PAT) or OAuth token for authentication.
   * This token would typically come from a UI input slot after user authentication.
   * @param token The GitHub token.
   */
  public setAuthToken(token: string): void {
    this.githubToken = token;
    // The interceptor will pick up the updated token for subsequent requests.
  }

  /**
   * Clears the authentication token.
   */
  public clearAuthToken(): void {
    this.githubToken = null;
  }

  /**
   * Fetches details of the authenticated user.
   * Requires a valid GitHub token.
   * @returns A promise that resolves to the GitHubUser object.
   */
  public async getAuthenticatedUser(): Promise<GitHubUser> {
    try {
      const response = await this.api.get<GitHubUser>('/user');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch authenticated user:', error);
      throw error;
    }
  }

  /**
   * Lists repositories for the authenticated user.
   * @param type Filter by type of repositories. Can be 'all', 'owner', 'member'.
   * @param sort Sort by 'created', 'updated', 'pushed', 'full_name'.
   * @param direction Order 'asc' or 'desc'.
   * @param page Page number for pagination.
   * @param per_page Number of items per page (max 100).
   * @returns A promise that resolves to an array of GitHubRepository objects.
   */
  public async listRepositories(params?: {
    type?: 'all' | 'owner' | 'member';
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    direction?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
  }): Promise<GitHubRepository[]> {
    try {
      const response = await this.api.get<GitHubRepository[]>('/user/repos', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to list repositories:', error);
      throw error;
    }
  }

  /**
   * Gets details for a specific repository.
   * @param owner The owner of the repository.
   * @param repo The name of the repository.
   * @returns A promise that resolves to a GitHubRepository object.
   */
  public async getRepositoryDetails(owner: string, repo: string): Promise<GitHubRepository> {
    try {
      const response = await this.api.get<GitHubRepository>(`/repos/${owner}/${repo}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get repository details for ${owner}/${repo}:`, error);
      throw error;
    }
  }

  /**
   * Lists commits for a specific repository.
   * @param owner The owner of the repository.
   * @param repo The name of the repository.
   * @param params Optional parameters like `sha` (branch/commit SHA), `path`, `author`, `since`, `until`.
   * @returns A promise that resolves to an array of GitHubCommit objects.
   */
  public async listCommits(
    owner: string,
    repo: string,
    params?: {
      sha?: string; // SHA or branch name
      path?: string;
      author?: string;
      since?: string; // ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ
      until?: string; // ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ
      page?: number;
      per_page?: number;
    }
  ): Promise<GitHubCommit[]> {
    try {
      const response = await this.api.get<GitHubCommit[]>(`/repos/${owner}/${repo}/commits`, { params });
      return response.data;
    } catch (error) {
      console.error(`Failed to list commits for ${owner}/${repo}:`, error);
      throw error;
    }
  }

  /**
   * Lists pull requests for a specific repository.
   * @param owner The owner of the repository.
   * @param repo The name of the repository.
   * @param state Filter by state: 'open', 'closed', or 'all'.
   * @param head Filter by head branch and optionally owner. Format: `owner:branch-name`.
   * @param base Filter by base branch name.
   * @param sort Sort by 'created', 'updated', 'popularity', 'long-running'.
   * @param direction Order 'asc' or 'desc'.
   * @param page Page number for pagination.
   * @param per_page Number of items per page (max 100).
   * @returns A promise that resolves to an array of GitHubPullRequest objects.
   */
  public async listPullRequests(
    owner: string,
    repo: string,
    params?: {
      state?: 'open' | 'closed' | 'all';
      head?: string;
      base?: string;
      sort?: 'created' | 'updated' | 'popularity' | 'long-running';
      direction?: 'asc' | 'desc';
      page?: number;
      per_page?: number;
    }
  ): Promise<GitHubPullRequest[]> {
    try {
      const response = await this.api.get<GitHubPullRequest[]>(`/repos/${owner}/${repo}/pulls`, { params });
      return response.data;
    } catch (error) {
      console.error(`Failed to list pull requests for ${owner}/${repo}:`, error);
      throw error;
    }
  }

  /**
   * Lists workflow runs for a specific repository.
   * @param owner The owner of the repository.
   * @param repo The name of the repository.
   * @param params Optional parameters like `branch`, `event`, `status`.
   * @returns A promise that resolves to an array of GitHubWorkflowRun objects.
   */
  public async listWorkflowRuns(
    owner: string,
    repo: string,
    params?: {
      branch?: string;
      event?: string;
      status?: 'completed' | 'action_required' | 'cancelled' | 'failure' | 'neutral' | 'skipped' | 'stale' | 'success' | 'timed_out' | 'in_progress' | 'queued' | 'requested' | 'waiting';
      page?: number;
      per_page?: number;
    }
  ): Promise<GitHubWorkflowRun[]> {
    try {
      const response = await this.api.get<{ total_count: number; workflow_runs: GitHubWorkflowRun[] }>(
        `/repos/${owner}/${repo}/actions/runs`,
        { params }
      );
      return response.data.workflow_runs;
    } catch (error) {
      console.error(`Failed to list workflow runs for ${owner}/${repo}:`, error);
      throw error;
    }
  }

  /**
   * Gets the logs for a specific workflow run.
   * Note: This returns a raw text response, not JSON.
   * @param owner The owner of the repository.
   * @param repo The name of the repository.
   * @param run_id The ID of the workflow run.
   * @returns A promise that resolves to the raw log content as a string.
   */
  public async getWorkflowRunLogs(owner: string, repo: string, run_id: number): Promise<string> {
    try {
      const response = await this.api.get<string>(
        `/repos/${owner}/${repo}/actions/runs/${run_id}/logs`,
        { responseType: 'text' } // Important for raw log data
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to get logs for workflow run ${run_id} in ${owner}/${repo}:`, error);
      throw error;
    }
  }

  // --- Additional GitHub API methods can be added here as needed ---
  // e.g., createIssue, updatePullRequest, manageWebhooks, etc.
}

// --- Example Usage (for demonstration, not part of the production file) ---
/*
// In a UI component or a higher-level service:
import { GitHubService } from './githubService';

// Assume the token is securely obtained from user input or environment
const githubToken = process.env.GITHUB_PAT || 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN';

if (!githubToken) {
  console.error('GitHub token not provided. Please set GITHUB_PAT or pass it to the service.');
  // Handle UI prompt for token
} else {
  const githubService = new GitHubService(githubToken);

  // Example: Fetch authenticated user
  githubService.getAuthenticatedUser()
    .then(user => console.log('Authenticated GitHub User:', user.login))
    .catch(error => console.error('Error fetching user:', error));

  // Example: List repositories
  githubService.listRepositories({ type: 'owner', sort: 'updated', direction: 'desc', per_page: 5 })
    .then(repos => {
      console.log('My Repositories:', repos.map(repo => repo.full_name));
      if (repos.length > 0) {
        const firstRepo = repos[0];
        // Example: List commits for the first repository
        githubService.listCommits(firstRepo.owner.login, firstRepo.name, { per_page: 3 })
          .then(commits => console.log(`Recent commits for ${firstRepo.full_name}:`, commits.map(c => c.commit.message)))
          .catch(error => console.error('Error fetching commits:', error));

        // Example: List pull requests
        githubService.listPullRequests(firstRepo.owner.login, firstRepo.name, { state: 'open' })
          .then(prs => console.log(`Open PRs for ${firstRepo.full_name}:`, prs.map(pr => pr.title)))
          .catch(error => console.error('Error fetching PRs:', error));

        // Example: List workflow runs
        githubService.listWorkflowRuns(firstRepo.owner.login, firstRepo.name, { status: 'failure' })
          .then(runs => console.log(`Failed Workflow Runs for ${firstRepo.full_name}:`, runs.map(run => `${run.name} (${run.conclusion})`)))
          .catch(error => console.error('Error fetching workflow runs:', error));
      }
    })
    .catch(error => console.error('Error fetching repositories:', error));
}
*/