# TalentBridge

## 💻[See the App!](https://talentbridgeweb.netlify.app/) 

![Talent Bridge Logo](./cover.png)

## 📝 Description 

"This project is a web platform for managing events and collaborative projects. It allows users to create, join, and manage events and projects, while handling notifications, team members, and (soon) communication through email integration. Our mission: **building a future through talent, one project and event at a time**"

#### [Client Repo here](https://github.com/ana-badolato/TalentBridgeClient)
#### [Server Repo here](https://github.com/ana-badolato/TalentBridgeServer) 

## 📌 Backlog Functionalities 

- Send messages via email/chat (email currently being implemented)
- Add lecturers to events

## 💡 Technologies used 

- JavaScript
- React
- Express
- Axios 
- Node.js
- MongoDB

# 🖥️ Server Structure 

## 📋 Models 

User model

```javascript
{
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  favs: [{type: Schema.Types.ObjectId,ref:'Game'}]
}
```

Project model

```javascript
{
  title: {type: String, required: true},
  description: {type: String, maxlength: 1000},
  mainObjective: {type: String, maxlength: 250, required: true},
  location: {type: String},
  startDate: {type: Date, default: Date.now},
  image: {type: String, default: "https://res.cloudinary.com/drqiultmd/image/upload/v1729707730/vzupen0uk9ctuhtatn2q.png"},
  category: {
    type: String,
    enum: [
      "Technology & Innovation", 
      "Sustainability & Environment", 
      "Art & Creativity", 
      "Health & Wellness", 
      "Education & Training", 
      "Community & Social Impact"
    ],
    required: true
  },
  owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
  teamMembers: [{type: Schema.Types.ObjectId, ref: "User"}]
}
```

Event model

```javascript
{
  name: {type: String, required: true},
  mainObjective: {type: String, maxlength: 250, required: true},
  description: {type: String, maxlength: 1000},
  date: {type: Date, required: true},
  time: {type: String, required: true, match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Please enter a valid time in HH:mm format"]},
  address: {type: String, required: true},
  location: {
    lat: {type: Number, required: true},
    lng: {type: Number, required: true}
  },
  category: {
    type: String,
    enum: [
      "Technology & Innovation", 
      "Sustainability & Environment", 
      "Art & Creativity", 
      "Health & Wellness", 
      "Education & Training", 
      "Community & Social Impact"
    ],
    required: true
  },
  capacity: {type: Number, default: 0},
  capacityCounter: {type: Number, default: 0},
  ticketRequired: {type: Boolean, default: false},
  price: {
    type: Number,
    required: function () { return this.ticketRequired },
    default: function () { return this.ticketRequired ? undefined : 0 },
    validate: {
      validator: function (value) {
        if (this.ticketRequired) return value > 0;
        return true;
      },
      message: "It is required to know if a ticket is mandatory to access the event"
    }
  },
  posterImage: {type: String, default: "https://res.cloudinary.com/drqiultmd/image/upload/v1729707730/fibd808bw4dixushxoln.png"},
  owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
  lecturer: [{type: Schema.Types.ObjectId, ref: "User", default: function () { return this.owner }}],
  attendees: [{type: Schema.Types.ObjectId, ref: "User"}],
  relatedProjects: {type: Schema.Types.ObjectId, ref: "Project"}
}
```

Notification model

```javascript
{
  from: {type: Schema.Types.ObjectId, ref: "User"},
  to: {type: Schema.Types.ObjectId, ref: "User"},
  project: {type: Schema.Types.ObjectId, ref: "Project"},
  event: {type: Schema.Types.ObjectId, ref: "Event"},
  message: {type: String},
  type: {type: String, required: true, enum: ["action", "info"]}
}
```


## 🌐 API Endpoints (backend routes) 
| METHOD  | URL                                              | REQUEST BODY                                                             | DESCRIPTION                                                                      |
|---------|--------------------------------------------------|--------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| GET     | /auth/verify                                      | n/a                                                                      | Verify user token and return payload                                              |
| GET     | /user/                                            | n/a                                                                      | Returns an array of all users                                                    |
| GET     | /profile                                          | n/a                                                                      | Returns the details of your profile                                              |
| GET     | /profile/:username                                | n/a                                                                      | Returns the details of a user                                                    |
| GET     | /user/project/:projectId                          | n/a                                                                      | Returns an array of users by project                                             |
| GET     | /user/event/:eventId                              | n/a                                                                      | Returns an array of users by event                                               |
| GET     | /user/:userId/project/owned                       | n/a                                                                      | Returns projects owned by the user                                               |
| GET     | /project/                                         | n/a                                                                      | Returns an array of all projects                                                 |
| GET     | /project/:projectId                               | n/a                                                                      | Returns the details of a project                                                 |
| GET     | /project/category/:category                       | n/a                                                                      | Returns an array of projects by category                                         |
| GET     | /project/:projectId/event                         | n/a                                                                      | Returns an array of events by project                                            |
| GET     | /project/user/:projectsUser                       | n/a                                                                      | Returns an array of projects by authenticated user                               |
| GET     | /project/user/:username/projects                  | n/a                                                                      | Returns an array of projects by non-authenticated user                           |
| GET     | /event/                                           | n/a                                                                      | Returns an array of all events                                                   |
| GET     | /event/:eventId                                   | n/a                                                                      | Returns the details of an event                                                  |
| GET     | /event/category/:category                         | n/a                                                                      | Returns an array of events by category                                           |
| GET     | /event/user/:eventsUser                           | n/a                                                                      | Returns an array of events by user authenticated user                            |
| GET     | /event/user/:username/events                      | n/a                                                                      | Returns an array of events by non-authenticated user                             |
| GET     | /notification/:userId                             | n/a                                                                      | Returns an array of notifications from a user                                    |
| POST    | /auth/signup                                      | {accountEmail, password, username}                                        | Creates a new user in the database                                               |
| POST    | /auth/login                                       | {accountEmail, password}                                                 | Verifies accountEmail and password and returns a JWT                             |
| POST    | /project/                                         | {title, description, mainObjectives, location, startDate, image, category, owner, teamMembers} | Creates a new project                                                            |
| POST    | /event/                                           | {name, description, date, time, address, location, category, capacity, capacityCounter, ticketsRequired, price, postedImage, owner, lecturer, attendees, relatedProjects} | Creates a new event                                                              |
| POST    | /notification/                                    | {from, to, project, event, message}                                       | Creates a new notification                                                       |
| POST    | /sendemail                                        | {senderEmail, recipientEmail, subject, message}                           | Creates a new mail                                                               |
| POST    | /upload                                           | {image: File}                                                            | Uploads an image to the server and returns its URL                               |
| PUT     | /user/:userId                                     | {username, profilePicture, skills, contactEmail, location, bio}           | Updates the details of a user                                                    |
| PUT     | /project/:projectId                               | {title, description, mainObjectives, location, startDate, image, category, owner, teamMembers} | Update the details of a project                                                  |
| PUT     | /event/:eventId                                   | {name, description, date, time, address, location, category, capacity, capacityCounter, ticketsRequired, price, postedImage, owner, lecturer, attendees, relatedProjects} | Updates the details of an event                                                  |
| PUT     | /:eventId/join                                    | {attendeeId}                                                             | Allows a user to join an event                                                   |
| PUT     | /notification/:notificationId/accept              | n/a                                                                      | Accepts a project request                                                        |
| PUT     | /notification/:notificationId/reject              | n/a                                                                      | Rejects a project request                                                        |
| PATCH   | /project/:projectId/removeTeamMember/:userId       | n/a                                                                      | Removes a teamMember from a project                                              |
| PATCH   | /project/:projectId/addTeamMember/:userId          | n/a                                                                      | Adds a teamMember to a project                                                   |
| PATCH   | /event/:eventId/removeLecturer/:userId             | n/a                                                                      | Removes a lecturer from an event                                                 |
| PATCH   | /event/:eventId/addLecturer/:userId                | n/a                                                                      | Adds a lecturer to an event                                                      |
| PATCH   | /event/:eventId/addAttendee/:userId                | n/a                                                                      | Adds an attendee to an event                                                     |
| PATCH   | /event/:eventId/addAttendees/:userId               | n/a                                                                      | Adds attendees to an event                                                       |
| PATCH   | /event/:eventId/incrementCapacityCounter           | n/a                                                                      | Adds to capacityCounter property                                                 |
| DELETE  | /project/:projectId                               | n/a                                                                      | Deletes a project                                                                |
| DELETE  | /event/:eventId                                   | n/a                                                                      | Deletes an event                                                                 |
| DELETE  | /notification/:notificationId                     | n/a                                                                      | Deletes a notification                                                           |

## 🔗 Links 

### 👥Collaborators

[Ana Badolato](https://github.com/ana-badolato)

[Núria Soley](https://github.com/NuriaSoley)

### 📁 Project 

[Repository Link Client](https://github.com/ana-badolato/TalentBridgeClient)

[Repository Link Server](https://github.com/ana-badolato/TalentBridgeServer)

[🚀 Deploy Link](https://talentbridgeweb.netlify.app/)


### 📊Slides 

[Slides Link](https://docs.google.com/presentation/d/1HkBky47yAJdYXUKvhw6kafLBSuF5vaREZ-ctHERr45g/edit#slide=id.p)