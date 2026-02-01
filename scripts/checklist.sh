#!/usr/bin/env bash
set -euo pipefail

FILE="$(dirname "$0")/../docs/deployment/pre-production-checklist.md"

usage() {
  cat <<EOF
Usage:
  $0 list                # list outstanding tasks
  $0 check N "Evidence: ..." "Completed by: name"  # mark Nth outstanding task as done and append evidence

Examples:
  $0 list
  $0 check 3 "Evidence: PR #123" "Completed by: eddie"
EOF
  exit 1
}

list_tasks() {
  # Print each unchecked item with an index and the line number
  awk 'BEGIN{idx=0} /^- \[ \] /{idx++ ; print idx ": " substr($0, 6)}' "$FILE"
}

check_task() {
  idx_to_check=$1
  evidence=$2
  completed_by=$3

  # find Nth unchecked line number
  target_line=$(awk -v n=$idx_to_check 'BEGIN{c=0} /^- \[ \] /{c++; if(c==n){print NR; exit}}' "$FILE")
  if [ -z "$target_line" ]; then
    echo "No such unchecked task: $idx_to_check" >&2
    exit 2
  fi

  # replace the checkbox at that line with checked
  sed -i "${target_line}s/- \[ \]/- [x]/" "$FILE"

  # insert or update Evidence / Completed by / Date lines after the task (next 3 lines)
  date_str=$(date -u +%Y-%m-%d)
  insert_line=$((target_line+1))
  sed -i "${insert_line}i\  - Evidence: ${evidence}\n  - Completed by: ${completed_by}\n  - Date: ${date_str}" "$FILE"

  echo "Task #$idx_to_check marked as done. Don't forget to commit the change (git add/commit/push)."
}

if [ $# -lt 1 ]; then
  usage
fi

cmd=$1
case "$cmd" in
  list)
    list_tasks
    ;;
  check)
    if [ $# -lt 4 ]; then
      echo "check requires: N "Evidence..." "Completed by..."" >&2
      usage
    fi
    check_task "$2" "$3" "$4"
    ;;
  *)
    usage
    ;;
esac
