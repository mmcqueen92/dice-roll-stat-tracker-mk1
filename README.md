Dice Stats Tracker

Dice Stats Tracker is a web application designed for Dungeons & Dragons (D&D) players to track and analyze their dice rolls during gameplay. The app allows users to create accounts, manage their D&D characters, log their dice rolls, and view statistics on their past rolls to help them better understand their in-game performance (i.e. complain about their bad luck with analytics to back it up)

Key Features:

User Authentication: Secure login and account creation using JWT (JSON Web Tokens) and password hashing with BCrypt.
Character Management: Users can create and manage multiple characters, each with their own profile and set of dice rolls.
Dice Roll Tracking: Log details about dice rolls, including dice type (e.g., d20, d12), roll type (attack, skill check, saving throw), and the result of the roll.
Statistics Dashboard: View summaries and statistics of past dice rolls, including success rates, roll averages, and more.
Mobile-Friendly Design: Conditional CSS ensures a smooth experience on both desktop and mobile devices.

Built With:

Front-End:
React: A dynamic user interface built with React, including reusable components and hooks for state management.
Material UI: Provides a responsive and consistent design with pre-built components, customized for this project.
Axios: For handling HTTP requests between the front-end and back-end.

Back-End:
ASP.NET Core 8.0: RESTful API built with ASP.NET Core, utilizing the latest version to handle routing, controllers, and business logic.
Entity Framework Core: For interacting with a SQL Server database, handling data persistence and relationships between users, characters, and dice rolls.
JWT Authentication: Secure user authentication and authorization using Microsoft.AspNetCore.Authentication.JwtBearer.

Database:
SQL Server: The back-end database used to store users, characters, and dice roll data. Queries are efficiently managed via Entity Framework Core.

Learning Goals and Challenges:
This project was my first experience using ASP.NET Core. One of my primary goals was to build a full-stack web application with a .NET back-end and React front-end, which allowed me to learn C# and ASP.NET Core.

Although I had worked with React before, this project allowed me to practice and improve my skills. I also integrated Material UI for the front-end design, which was new for me in a React context. Learning to customize these components for this project was a valuable experience.

Another important aspect of this project was ensuring responsive design. Since many D&D players may use this tool on mobile devices, I made sure to include conditional CSS to adapt the interface for different screen sizes and devices.

Installation and Usage:

Prerequisites:
.NET 8.0 SDK
Node.js (v14 or higher)
SQL Server (local or cloud instance)

Backend Setup (ASP.NET Core):
Clone the repository:
bash
Copy code
git clone
cd DiceStatsTracker
Install the necessary dependencies:
bash
Copy code
dotnet restore
Set up the SQL Server database. You can modify the connection string in appsettings.json to point to your own SQL Server instance.
Apply migrations to create the database:
bash
Copy code
dotnet ef database update
Run the back-end server:
bash
Copy code
dotnet run

Front-End Setup (React):
Navigate to the client directory:
bash
Copy code
cd client
Install dependencies:
bash
Copy code
npm install
Start the development server:
bash
Copy code
npm start

Usage:
Open the browser and navigate to http://localhost:3000 for the front-end.
Register a new account, create a character, and start logging your dice rolls!

Screenshots:

!["screenshot of the home page - large screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/home-lg.PNG?raw=true)

!["screenshot of the register page - large screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/register-lg.PNG?raw=true)

!["screenshot of the login page - large screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/login-lg.PNG?raw=true)

!["screenshot of the user-dashboard page - large screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/user-dash%20lg.PNG?raw=true)

!["screenshot of the character management page - large screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/char-man-lg.PNG?raw=true)

!["screenshot of the character management page - create new - large screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/new-char-lg.PNG?raw=true)

!["screenshot of the character management page - edit - large screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/edit-char-lg.PNG?raw=true)

!["screenshot of the character management page - delete - large screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/delete-char-lg.PNG?raw=true)

!["screenshot of the active dashboard page - large screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/active-dash-lg.PNG?raw=true)

!["screenshot of the active dashboard page (2) - large screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/active-dash-lg-2.PNG?raw=true)

!["screenshot of the stats page - overview - large screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/stats-overview-lg.PNG?raw=true)

!["screenshot of the stats page - trends - large screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/stats-trends-lg.PNG?raw=true)

!["screenshot of the stats page - trends (2) - large screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/stats-trends-lg-2.PNG?raw=true)

!["screenshot of the stats page - distribution - large screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/stats-dist-lg.PNG?raw=true)

!["screenshot of the stats page - types - large screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/stats-types-lg.PNG?raw=true)



!["screenshot of the home page - small screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/home-sm.PNG?raw=true)

!["screenshot of the register page - small screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/register-sm.PNG?raw=true)

!["screenshot of the login page - small screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/login-sm.PNG?raw=true)

!["screenshot of the user-dashboard page - small screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/user-dash-sm.PNG?raw=true)

!["screenshot of the character management page - small screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/char-man-sm.PNG?raw=true)

!["screenshot of the character management page - create new - small screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/new-char-sm.PNG?raw=true)

!["screenshot of the character management page - edit - small screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/edit-char-sm.PNG?raw=true)

!["screenshot of the character management page - delete - small screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/delete-char-sm.PNG?raw=true)

!["screenshot of the active dashboard page - small screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/active-dash-sm.PNG?raw=true)

!["screenshot of the active dashboard page (2) - small screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/active-dash-sm-2.PNG?raw=true)

!["screenshot of the stats page - overview - small screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/stats-overview-sm.PNG?raw=true)

!["screenshot of the stats page - trends - small screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/stats-trends-sm.PNG?raw=true)

!["screenshot of the stats page - trends (2) - small screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/stats-trends-sm-2.PNG?raw=true)

!["screenshot of the stats page - trends (3) - small screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/stats-trends-sm-3.PNG?raw=true)

!["screenshot of the stats page - distribution - small screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/stats-dist-sm.PNG?raw=true)

!["screenshot of the stats page - types - small screen"](https://github.com/mmcqueen92/dice-roll-stat-tracker-mk1/blob/main/docs/stats-types-sm.PNG?raw=true)






License
This project is licensed under the MIT License - see the LICENSE file for details.