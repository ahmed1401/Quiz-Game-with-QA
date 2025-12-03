const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  incorrectAnswers: {
    type: [String],
    required: true,
    validate: [arr => arr.length === 3, 'Must have exactly 3 incorrect answers']
  },
  correctAnswer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Computer Science', 'Maths', 'General Knowledge', 'Sports']
  },
});


module.exports = mongoose.model('Question', questionSchema);
