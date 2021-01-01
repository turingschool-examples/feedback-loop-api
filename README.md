# Feedback Loop API

To be used with the Cypress lesson.

## Set Up

Clone down this repo. (Do **NOT** nest it inside your feedback-loop-ui repo!)

CD into this repo.

Run `npm install`.

Run `npm start` to start the server.

## Endpoints

### GET a user by its id

URL: `http://localhost:3001/api/v1/users/:id`

Sample URL: `http://localhost:3001/api/v1/users/2`

Sample response (200):

```js
{
  email: "leta@turing.io",
  id: 2,
  image: "https://ca.slack-edge.com/T029P2S9M-U37MJAV0T-007ccf2f5eb2-512",
  name: "Leta Keane"
}
```

Sample response (404):

```js
  { message: 'User with the id of 2 does not exist.' }
```

### GET all teammates for a user

URL: `http://localhost:3001/api/v1/users/:id/teammates`

Sample URL: `http://localhost:3001/api/v1/users/2/teammates`

Sample response (200):

```js
{
  "teammates": [
    {
      email: "hannah@turing.io",
      id: 1,
      image: "https://ca.slack-edge.com/T029P2S9M-UPE0QSWEQ-d4bebe6f4d88-512",
      name: "Hannah Hudson",
      delivered: false
    },
    {
      email: "khalid@turing.io",
      id: 3,
      image: "https://ca.slack-edge.com/T029P2S9M-UDR1EJKFS-9351230a5443-512",
      name: "Khalid Williams",
      delivered: true
    }
  ]
}
```

Sample response (404):

```js
  { message: 'User with the id of 2 does not exist' }
```

### GET all feedback for a user

URL: `http://localhost:3001/api/v1/users/:id/feedback`

Sample URL: `http://localhost:3001/api/v1/users/2/feedback`

Sample response (200):

```js
{
  feedback: [
    {
      feedback: "Your feedback game is TOO strong.",
      senderId: 4,
      receiverId: 2
    },
    {
      feedback: "I appreciate your positive energy and how hard you work in supporting both students and other instructors alike.",
      senderId: 11,
      receiverId: 2
    }
  ]
}
```

Sample response (404):

```js
  { message: 'User with the id of 2 does not exist' }
```

### POST login a user

URL: `http://localhost:3001/api/v1/login`

Sample request:

```js
{
  body: JSON.stringify({
    email: "leta@turing.io",
    password: "keane20"
  }),
  headers: {
    "Content-Type": "application/json"
  }
}
```

Sample response (201): This is the idea that was submitted in the POST request

```js
{
  id: 2,
  image: "https://ca.slack-edge.com/T029P2S9M-U37MJAV0T-007ccf2f5eb2-512",
  name: "Leta Keane"
}
```

Sample BAD request:

```js
{
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email: "leta@turing.io"
  })
}
```

Sample BAD response (422):

```js
  { message: 'You are missing a required parameter of password' }
```

### POST Send feedback

URL: `http://localhost:3001/api/v1/users/:senderId/feedback/:receiverId`

Sample URL: `http://localhost:3001/api/v1/users/2/feedback/5`

Sample request:

```js
{
  body: JSON.stringify({
    feedback: "So excited to have you on the team!  You've been amazing!"
  }),
  headers: {
    "Content-Type": "application/json"
  }
}
```

Sample response (201): This is the idea that was submitted in the POST request

```js
{
  feedback: "So excited to have you on the team!  You've been amazing!",
  senderId: "2",
  receiverId: "5"
}
```

Sample response (404):

```js
{
  message: "The user you are trying to send feedback to with an id of 100 does not currently exist.  Please try again later."
}
```
