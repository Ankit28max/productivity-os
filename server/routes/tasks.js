const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// @route    GET api/tasks
// @desc     Get all tasks of the logged-in user
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error retrieving tasks' });
  }
});

// @route    POST api/tasks
// @desc     Create a new task
// @access   Private
router.post('/', auth, async (req, res) => {
  const { title, description, priority, status, dueDate, category } = req.body;

  try {
    const newTask = new Task({
      userId: req.user.id,
      title,
      description,
      priority,
      status,
      dueDate,
      category,
    });

    const task = await newTask.save();
    res.json({
      success: true,
      task,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error creating task' });
  }
});

// @route    PUT api/tasks/:id
// @desc     Update a task
// @access   Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, priority, status, dueDate, category } = req.body;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Verify user owns the task
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this task' });
    }

    // Build update object
    const taskFields = {};
    if (title !== undefined) taskFields.title = title;
    if (description !== undefined) taskFields.description = description;
    if (priority !== undefined) taskFields.priority = priority;
    if (status !== undefined) taskFields.status = status;
    if (dueDate !== undefined) taskFields.dueDate = dueDate;
    if (category !== undefined) taskFields.category = category;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );

    res.json({
      success: true,
      task,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error updating task' });
  }
});

// @route    DELETE api/tasks/:id
// @desc     Delete a task
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Verify user owns the task
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task successfully removed',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error deleting task' });
  }
});

module.exports = router;
