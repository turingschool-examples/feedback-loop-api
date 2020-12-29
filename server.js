const express = require('express');
const cors = require('express-cors');
const port = process.env.PORT || 3001;
const app = express();
const users = require('./mockData/users');
const feedback = require('./mockData/feedback');

app.locals = {
  title: 'Feedback Loop API',
  users,
  feedback
}

app.use(express.json());
app.use(cors({ allowedOrigins: ['localhost:3000'] }));

app.post('/api/v1/login', (req, res) => {
  const user = req.body;

  for (let requiredParameter of ['email', 'password']) {
    if (!user[requiredParameter]) {
      return res.status(422).json({
        message: `You are missing a required parameter of ${requiredParameter}`
      });
    }
  }

  const { email, password } = user;
  const foundUser = app.locals.users.find(user => user.email === email && user.password === password);

  if (!foundUser) {
    return res.status(401).json({ message: `Email and password do not match.  Please try again.` });
  }

  const { id, image, name } = foundUser;

  res.status(201).json({ id, image, name });
})

app.get('/api/v1/users/:id', (req, res) => {
  const { id: userId } = req.params;
  const foundUser = app.locals.users.find(user => user.id === parseInt(userId));

  if (!foundUser) {
    return res.status(404).json({ message: `User with the id of ${userId} does not exist.` })
  }

  const { email, id, image, name } = foundUser;
  res.status(200).json({ email, id, image, name });
})

app.get('/api/v1/users/:id/teammates', (req, res) => {
  const { id: userId } = req.params;
  const foundUser = app.locals.users.find(user => user.id === parseInt(userId));

  if (!foundUser) {
    return res.status(404).json({ message: `User with the id of ${userId} does not exist.` })
  }

  let teammates = app.locals.users.map(user => {
    const { email, id, image, name } = user;
    const foundFeedback = app.locals.feedback.find(message => {
      return message.senderId === parseInt(userId) && message.receiverId === id
    });
    return { email, id, image, name, delivered: !!foundFeedback };
  });

  teammates = teammates.filter(user => parseInt(userId) !== user.id);

  res.status(200).json({ teammates });
});

app.get('/api/v1/users/:id/feedback', (req, res) => {
  const { id } = req.params;
  const foundUser = app.locals.users.find(user => user.id === parseInt(id));

  if (!foundUser) {
    return res.status(404).json({ message: `User with the id of ${id} does not exist.` })
  }

  const receivedFeedback = app.locals.feedback.filter(feedback => feedback.receiverId === foundUser.id);
  res.status(200).json({ feedback: receivedFeedback });
})

app.post('/api/v1/users/:senderId/feedback/:receiverId', (req, res) => {
  const { senderId, receiverId } = req.params;

  const foundSender = app.locals.users.find(user => user.id === parseInt(senderId));
  const foundReceiver = app.locals.users.find(user => user.id === parseInt(receiverId));

  if (!foundSender) {
    return res.status(404).json({ message: `The user trying to send this message with an id of ${senderId} does not exist.  Please try again later.`})
  }

  if (!foundReceiver) {
    return res.status(404).json({ message: `The user you are trying to send feedback to with an id of ${receiverId} does not currently exist.  Please try again later.`});
  }

  const { feedback } = req.body;
  app.locals.feedback.push({ 
    feedback,
    senderId: parseInt(senderId),
    receiverId: parseInt(receiverId)
  });

  res.status(201).json({ feedback, senderId, receiverId });

})

app.listen(port, () => {
  console.log(`${app.locals.title} is now running on ${port}!`)
})