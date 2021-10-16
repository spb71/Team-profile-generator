const inquirer = require('inquirer');
const fs = require('fs');
const Engineer = require('./lib/Engineer.js');
const Intern = require('./lib/Intern.js');
const Manager = require('./lib/Manager.js');

const employees = [];

function init() {
    beginHTML();
    addTeamMember();
}

function addTeamMember() {
    inquirer.prompt([{
        type: "input",
        message: "Enter team member's name.",
        name: "name",
    },
    {
        type: "list",
        message: "Enter team member's role?",
        choices: [
            "Engineer",
            "Intern",
            "Manager",
        ],
        name: "role",
    },
    {
        type: "input",
        message: "Enter team member's id.",
        name: "id",
    },
    {
        type: "input",
        message: "Enter team member's email address.",
        name: "email"
    }])
    .then(function({name, role, id, email}) {
        let rolePlayer = "";
        if (role === "Engineer") {
            rolePlayer = "Github username"
        } else if (role === "Intern") {
            rolePlayer = "School"
        } else {
            rolePlayer = "office number"
        }
        inquirer.prompt([{
            message: `Enter team member's ${rolePlayer}.`,
            name: "rolePlayer"
        },
        {
            type: "list",
            message: "Would you like to add more team members",
            choices: [
                "yes",
                "no"
            ],
            name: "moreTeamMembers"
        }])
        .then(function({rolePlayer, moreTeamMembers}) {
            let newTeamMember;
            if (role === "Engineer") {
                newTeamMember = new Engineer(name, id, email, rolePlayer);
            } else if (role === "Intern") {
                newTeamMember = new Intern(name, id, email, rolePlayer);
            } else {
                newTeamMember = new Manager(name, id, email, rolePlayer);
            }
            employees.push(newTeamMember);
            midHTML(newTeamMember)
            .then(function() {
                if(moreTeamMembers === "yes") {
                    addTeamMember();
                } else {
                    endHTML();
                }
            })
        });
    });
}

function beginHTML() {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <title>Team Profile</title>
</head>
<body>
    <nav class="navbar navbar-dark bg-dark mb-5">
        <span class="navbar-brand mb-0 h1 w-100 text-center">Team Profile</span>
    </nav>
    <div class="container">
        <div class="row">`;
    fs.writeFile("./dist/team.html", html, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function midHTML(member) {
    return new Promise(function(resolve, reject) {
        const name = member.getName();
        const role = member.getRole();
        const id = member.getId();
        const email = member.getEmail();
        let data = ""
        if (role === "Engineer") {
            const github = member.getGithub();
            data = `
        <div class="col-6">
            <div class="card mx-auto mb-3" style="width: 18rem">
                <h5 class="card-header">${name}<br /><br />Engineer</h5>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">ID: ${id}</li>
                    <li class="list-group-item">Email Address: ${email}</li>
                    <li class="list-group-item">GitHub: ${github}</li>
                </ul>
            </div>
        </div>`;
        } else if (role === "Intern") {
            const school = member.getSchool();
            data = `
        <div class="col-6">
            <div class="card mx-auto mb-3" style="width: 18rem">
                <h5 class="card-header">${name}<br /><br />Intern</h5>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">ID: ${id}</li>
                    <li class="list-group-item">Email Address: ${email}</li>
                    <li class="list-group-item">School: ${school}</li>
                </ul>
            </div>
        </div>`;
        } else {
            const officeNumber = member.getOfficeNumber();
            data = `
        <div class="col-6">
            <div class="card mx-auto mb-3" style="width: 18rem">
                <h5 class="card-header">${name}<br /><br />Manager</h5>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">ID: ${id}</li>
                    <li class="list-group-item">Email Address: ${email}</li>
                    <li class="list-group-item">Office Number: ${officeNumber}</li>
                </ul>
            </div>
        </div>`;
        }
        fs.appendFile("./dist/team.html", data, function(err) {
            if (err) {
                return reject(err);
            }
            return resolve();
        })
    })
}

function endHTML() {
    const html = ` 
    </div>
</body>
</html>`;

    fs.appendFile("./dist/team.html", html, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Team.html file created!!")
        };
    });
}

init();