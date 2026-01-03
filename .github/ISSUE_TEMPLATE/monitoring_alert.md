name: Monitoring alert
about: Automated alert created when invite retry failures are detected by the monitor workflow
title: "Automated: Invite retry failures ({{failed}} failed)"
labels: monitoring, automated

---

**Automated monitoring alert**

- **Site:** {{site}}
- **Detected failures:** {{failed}}
- **Time:** {{time}}
- **Workflow run:** {{run_url}}

## Investigation checklist
- [ ] Confirm the count in `/api/admin/invite-stats.json`
- [ ] Inspect `invites` rows and `enquiries.events` for failures
- [ ] Re-run retry endpoint manually: `curl "${{site}}/api/admin/retry-invites.json?secret=..."`
- [ ] If real sends are involved, check `RESEND` dashboard for message details
- [ ] If needed, re-run or escalate to on-call

## Notes
If the repository secret `MONITORING_MENTION` is set (for example, `@your-org/your-team`), the workflow will mention that team/user when creating or updating this issue.

Please add findings and steps taken in a comment on this issue.
