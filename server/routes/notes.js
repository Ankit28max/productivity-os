const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');

// @route    GET api/notes
// @desc     Get all notes of the logged-in user
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ isPinned: -1, updatedAt: -1 });
    res.json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error retrieving notes' });
  }
});

// @route    POST api/notes
// @desc     Create a new note
// @access   Private
router.post('/', auth, async (req, res) => {
  const { title, content, tags, isPinned, isArchived } = req.body;

  try {
    const newNote = new Note({
      userId: req.user.id,
      title: title || 'Untitled Note',
      content: content || '',
      tags: tags || [],
      isPinned: isPinned || false,
      isArchived: isArchived || false,
    });

    const note = await newNote.save();
    res.json({
      success: true,
      note,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error creating note' });
  }
});

// @route    PUT api/notes/:id
// @desc     Update a note
// @access   Private
router.put('/:id', auth, async (req, res) => {
  const { title, content, tags, isPinned, isArchived } = req.body;

  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Verify user owns the note
    if (note.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this note' });
    }

    // Build update object
    const noteFields = {};
    if (title !== undefined) noteFields.title = title;
    if (content !== undefined) noteFields.content = content;
    if (tags !== undefined) noteFields.tags = tags;
    if (isPinned !== undefined) noteFields.isPinned = isPinned;
    if (isArchived !== undefined) noteFields.isArchived = isArchived;

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: noteFields },
      { new: true }
    );

    res.json({
      success: true,
      note,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error updating note' });
  }
});

// @route    DELETE api/notes/:id
// @desc     Delete a note
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Verify user owns the note
    if (note.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this note' });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Note successfully removed',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error deleting note' });
  }
});

module.exports = router;
