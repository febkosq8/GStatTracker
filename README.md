# **[GStatTracker](https://gstattracker.tk/)**

A web based application that helps to monitor various statistics of various GitHub users and their repositories.
Built by incorporating libraries and services like ReactJS, NodeJS, MongoDB, BootStrap, SCSS, Google Analytics 4 to work with the [GitHub REST API](https://docs.github.com/en/rest).

It has a scalable design and supports many functions that enable a good overview onto various data points available from GitHub API.

## Logging In

- New users need to install our GitHub app onto the individual user account once, in order to gain access to private user repositories
- If the GitHub app is already installed, follow the existing user option to login to the application

# **Features**

- [Get crucial data about a user](https://gstattracker.tk/user) which includes details like their Username, Name, GitHub ID, Account Creation Timestamp, Followers / Following count, a list of Repositories linked to that user with each Repository entry containing the Repository Name, Visibility, Creation Timestamp, Description & URL.
- [Get crucial data about specific repository](https://gstattracker.tk/repo) which includes details like Name, Author Name, Creation Timestamp, Last Commit Timestamp, List of Languages used, Pie Chart depicting all the Contributors and their Contributions & the Total number of Commits.
- [Get an overview on multiple repositories](https://gstattracker.tk/bulkrepo) which includes details like Name, Last Commit TimeStamp, Author Name, Message & URL.
- [Get an overview on a particular commit](https://gstattracker.tk/commit) which includes details like SHA, Repository Name, Commit TimeStamp, Author, Message, Total number of Additions, Deletions, Total Changes & a table which shows a detailed list of files that were changed in that particular commit.
- [Get an overview on all the commits made to a repository](https://gstattracker.tk/repocommit) which includes details like total number of commits being shown, a Line Graph depicting the number of commits per author per day, a list of commits with each of the entry having the commit SHA, TimeStamp, Author & Message.
- [Analyze a particular repository](https://gstattracker.tk/analyze) which includes details like total number of commits analyzed and an average grade for the repository, Statistics per Author and Commit. The average grade is calculated using the statistics data from both categories individual grades.
- [Configure](https://gstattracker.tk/config) various aspects of the application according to your preference. This allows access to crucial tools like enabling fetch from Log feature or checking how many API calls you have left over.
- Authentication System allowing the application to access private user data (Private Repositories)
- Multi Level Cache System (Request data to be pulled from logs. Disabled by Default)
- Commit Message Filter system when using Analyze a particular repository
- Automatic conversion of timestamps to user locale
- Hover over the info icon placed statistically to get information about that particular feature and what you can do with it.
- Hover over any TimeStamp to show Relative Time
- Ability to have a saved list of repositories to quickly analyze quick and easily
- Ability to increase your API calls by authentication feature. Login to GStatTracker to increase your API limit from 60 to 5000 per hour.
- Auto Error Handling ensures that when the application faces an error, it returns an informative message to the end user
- Status Icons for various UI elements ensuring the end user is always updated about the progress

# **Deployment Status**

Frontend ![GStatViewer](https://img.shields.io/website-up-down-green-red/https/gstattracker.tk.svg)

Backend ![GStatCore](https://img.shields.io/website-up-down-green-red/https/g-stat-core.herokuapp.com.svg)

# **Development Status** ![Generic badge](https://img.shields.io/badge/Beta-Testing-yellow.svg)

The project is open source and the source code will be released once the application development is over.

Maintenance Schedule - Not Planned

# **Development Team**

Febkosq8 - [GitHub](https://github.com/febkosq8)
