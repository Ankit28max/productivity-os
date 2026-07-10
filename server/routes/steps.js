const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const StepLog = require('../models/StepLog');

// @route    GET api/steps
// @desc     Get steps logs for the logged-in user
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const logs = await StepLog.find({ userId: req.user.id }).sort({ date: -1 }).limit(30);
    res.json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error retrieving steps logs' });
  }
});

// @route    POST api/steps
// @desc     Log or update steps count for a specific date
// @access   Private
router.post('/', auth, async (req, res) => {
  const { date, count, target } = req.body;

  if (!date || count === undefined) {
    return res.status(400).json({ success: false, message: 'Date and steps count are required' });
  }

  try {
    // Find existing log or create new one (upsert)
    let log = await StepLog.findOne({ userId: req.user.id, date });

    if (log) {
      log.count = count;
      if (target) log.target = target;
      await log.save();
    } else {
      log = new StepLog({
        userId: req.user.id,
        date,
        count,
        target: target || 10000,
      });
      await log.save();
    }

    res.json({
      success: true,
      log,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error saving steps log' });
  }
});

module.exports = router;
