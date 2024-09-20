const express = require('express');
const app = express();
const PORT = 3000;

let tasks = [];

app.use(express.json());

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const task = { id: Date.now(), text: req.body.text, imageUrl: req.body.imageUrl };
  tasks.push(task);
  res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const updatedText = req.body.text;

  tasks = tasks.map(task =>
    task.id === taskId ? { ...task, text: updatedText } : task
  );

  res.json({ success: true });
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  tasks = tasks.filter(task => task.id !== taskId);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
