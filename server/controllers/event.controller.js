const Event = require('../model/event.model.js');
const cloudinary = require('../config/cloudinary.js');
const User = require('../model/user.model.js');
const bcrypt = require('bcrypt');
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' }).populate(
      'organizer',
      'name email'
    );
    res.json({
      success: true,
      length: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createEvent = async (req, res) => {
  try {
    console.log(req.body);
    const { title, description, category, location, date, capacity } = req.body;

    //NOte handle the banner url here
    console.log(req.file); //undefined

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'nexus-Events',
    });
    console.log(result);

    const event = await Event.create({
      title,
      description,
      category,
      location,
      date,
      capacity,
      bannerUrl: result?.secure_url,
      organizer: req.user.id,
    });

    res.status(201).json({
      success: true,
      message:
        'Event Created Successfully , It will be visible  after the admin approval',
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//NOTE event details fetch krlo get single event :id
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate('organizer', 'name email');
    if (!event) {
      return res.status(404).json({
        message: 'Event not found',
      });
    }

    res.json({ success: true, event });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//NOTE bookevents

exports.bookevent = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, password } = req.body;
    console.log(id);
    const event = await Event.findById(id);
    console.log(event);

    let user = await User.findOne({ email });

    if (!user) {
      const hashPassword = await bcrypt.hash(password, 10);
      user = await User.create({ name, email, password: hashPassword });
    }

    console.log(user);

    if (event.attendee.some((a) => a.toString() === user._id.toString())) {
      return res.status(409).json({
        message: 'You have already Booked this event',
      });
    }
    event.attendee.push(user._id);
    await event.save();
    res.json({
      message:
        'Booking confirmed , Please check your mail , Use your password to login in the portel to see your booking',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//NOTE update Status
exports.updateStatus = async (req, res) => {
  try {
    console.log(req.body);
    const { status } = req.body;
    const { id } = req.params;
    const allowedStatus = ['approved', 'rejected'];

    if (!allowedStatus.includes(status)) {
      return res.json({
        message: `invalid status`,
      });
    }

    const event = await Event.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    res.json({
      message: `Event status change to ${status}`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
