# miquprof
 
Miquprof is a project that shall enable developers and project managers to fetch and combine data on projects from different sources. The goal is to fetch data from issue tracking system, version control and ci/cd providers.

The project consists of two parts the `miner` is responsible for fetching the data from the different sources, while the `website` imports the fetched data and allows to execute queries.

## Miner

The miner currently supports to fetch data from GitHub via the Octokit and isomorphic-git libary.

When using the miner, a private access token must be supplied as `PATOKEN` in a `.env` file in the source folder of the miner.
Additionaly the owner, repo and the output folder can be supplied to the miner as a comandline argument.
