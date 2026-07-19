# CI Quality Gate

The `Frontend Quality Gate` workflow runs for every pull request and for pushes to `develop` and `main`.

It installs the locked dependency set with `npm ci`, runs ESLint, and creates a production Next.js build.

After this workflow is merged, an organization administrator must enable the merge gate in GitHub:

1. Open `Settings` > `Branches` (or `Rules`) for `develop` and `main`.
2. Require a pull request before merging.
3. Require status checks to pass before merging.
4. Select `Frontend Quality Gate / Lint and build`.

Without the branch rule, GitHub displays CI results but still permits a manual merge after a failed run.
