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

router.post('/', auth, async (req, res) => {
  const { date, count, target, water, waterTarget, sleep, sleepTarget } = req.body;

  if (!date) {
    return res.status(400).json({ success: false, message: 'Date is required' });
  }

  try {
    // Find existing log or create new one (upsert)
    let log = await StepLog.findOne({ userId: req.user.id, date });

    if (log) {
      if (count !== undefined) log.count = count;
      if (target !== undefined) log.target = target;
      if (water !== undefined) log.water = water;
      if (waterTarget !== undefined) log.waterTarget = waterTarget;
      if (sleep !== undefined) log.sleep = sleep;
      if (sleepTarget !== undefined) log.sleepTarget = sleepTarget;
      await log.save();
    } else {
      log = new StepLog({
        userId: req.user.id,
        date,
        count: count !== undefined ? count : 0,
        target: target || 10000,
        water: water !== undefined ? water : 0,
        waterTarget: waterTarget || 2000,
        sleep: sleep !== undefined ? sleep : 0,
        sleepTarget: sleepTarget || 8,
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
