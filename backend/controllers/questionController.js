const Question = require('../models/Question');

exports.createQuestion = async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const questions = await Question.find(query);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};