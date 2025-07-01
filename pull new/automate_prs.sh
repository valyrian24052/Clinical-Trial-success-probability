  #!/bin/bash

REPO_PATH="/path/to/your/repo"  # 👈 Update this to your local repo path
cd "$REPO_PATH"

TOTAL_PRS=100

for i in $(seq 1 $TOTAL_PRS); do
    BRANCH_NAME="backdated-branch-$i"

    echo "🔧 Creating PR #$i on branch $BRANCH_NAME..."

    # Checkout new branch
    git checkout -b "$BRANCH_NAME" main

    # Run inline Python to generate backdated commits
    python3 - <<END
import os
from random import randint, sample

days_back = sample(range(0, 90), randint(1, 3))

for d in days_back:
    date_str = f"{d} days ago"
    filename = f"file_$d.txt"
    with open(filename, 'w') as f:
        f.write(f"Commit for {date_str}\n")
    os.system("git add .")
    os.system(f'git commit --date="{date_str}" -m "Backdated commit from {date_str}"')
END

    # Push to remote
    git push origin "$BRANCH_NAME"

    # Create PR
    gh pr create --base main --head "$BRANCH_NAME" --title "Automated PR #$i" --body "Backdated commits for PR $i"

    # Merge PR and delete branch
    gh pr merge "$BRANCH_NAME" --merge --delete-branch --yes

    echo "✅ Merged PR #$i"
done

echo "🎉 All $TOTAL_PRS PRs created, merged, and cleaned up!"
