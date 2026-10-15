# Add these docs to the local Git repository

This archive contains `docs/deployment-architecture/` at its root. It does not contain application source and does not overwrite application code.

1. Download `portfolio-deployment-architecture-docs.zip`.
2. In Windows, extract its contents to the repository root:

```powershell
Expand-Archive -Path "$env:USERPROFILE\Downloads\portfolio-deployment-architecture-docs.zip" -DestinationPath "C:\Users\user\Desktop\porfolio website" -Force
```

If the browser saved the ZIP somewhere else, change only the `-Path` value. `-DestinationPath` should be your existing repository root.

3. Review the files in `docs\deployment-architecture\` and inspect Git status:

```powershell
git status
```

4. Commit the documentation as a separate, documentation-only change:

```powershell
git add docs/deployment-architecture
git commit -m "Add deployment architecture documentation"
git push
```

No code or production configuration needs to change for this documentation commit. Do not add secrets, `.env` files, SQL dumps or local backups to the repository.
