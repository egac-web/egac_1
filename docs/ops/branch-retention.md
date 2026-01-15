# Branch retention policy

This short policy helps keep our repository tidy while keeping active work safe.

## Policy (recommended)

- Keep long-lived branches for: `main`, `staging`, `production` (if present), active release branches, and any branch with an **open PR** or active work.
- Delete remote branches once their PR has been **merged** into `main` (or `staging` if you use a promotion workflow).
- For other feature branches without an open PR, review after **30 days** of inactivity and delete if still unused.
- Enable **Automatically delete head branches** in the GitHub repository settings to remove branches after PR merges.
- When unsure, create an issue to discuss or notify branch owners before deletion.

## How to delete merged branches (safe)

1. Verify branch is merged into `main` and there are no outstanding PRs:

```sh
# list merged remote branches
git fetch --all --prune
git branch -r --merged origin/main
```

2. Delete a merged branch safely from remote:

```sh
git push origin --delete <branch-name>
```

## Suggested workflow for cleanup

- Weekly or monthly audit: list remote branches sorted by last commit date and check for ones with no open PRs and older than 30 days.
- When deleting, leave a note (issue or PR comment) if the branch was authored by someone else.

## Example commands

```sh
# list remote branches with last commit
git fetch --all --prune
git for-each-ref --sort=-committerdate refs/remotes/origin --format='%(committerdate:iso8601) %(refname:short) %(authorname)'

# find merged branches relative to main
git branch -r --merged origin/main | sed 's#origin/##' | grep -vE '^(main|production|staging)$'
```

---

*This is a small documentation-only change to make branch cleanup repeatable and low-risk.*
