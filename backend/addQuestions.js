require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const questions = [
  //-----Computer Science Questions---
  {
    question: "What does RAM stand for?",
    correctAnswer: "Random Access Memory",
    incorrectAnswers: [
      "Read-Only Memory",
      "Run Access Mode",
      "Rapid Application Manager"
    ],
    category: "Computer Science"
  },
  {
    question: "Which is the smallest unit of data in a computer?",
    correctAnswer: "Bit",
    incorrectAnswers: [
      "Byte",
      "Nibble",
      "Word"
    ],
    category: "Computer Science"
  },
  {
    question: "What is the time complexity of binary search?",
    correctAnswer: "O(log n)",
    incorrectAnswers: [
      "O(n)",
      "O(n log n)",
      "O(1)"
    ],
    category: "Computer Science"
  },
  {
    question: "Who is considered the father of computer science?",
    correctAnswer: "Alan Turing",
    incorrectAnswers: [
      "Charles Babbage",
      "John von Neumann",
      "Ada Lovelace"
    ],
    category: "Computer Science"
  },

  //----Mathematics Questions------
  {
    question: "What is the value of π (pi) to two decimal places?",
    correctAnswer: "3.14",
    incorrectAnswers: [
      "3.15",
      "3.13",
      "3.16"
    ],
    category: "Maths"
  },
  {
    question: "What is 7 multiplied by 8?",
    correctAnswer: "56",
    incorrectAnswers: [
      "54",
      "64",
      "48"
    ],
    category: "Maths"
  },
  {
    question: "What is the sum of the interior angles of a triangle?",
    correctAnswer: "180 degrees",
    incorrectAnswers: [
      "90 degrees",
      "360 degrees",
      "270 degrees"
    ],
    category: "Maths"
  },
  {
    question: "If a circle has a diameter of 10 cm, what is its radius?",
    correctAnswer: "5 cm",
    incorrectAnswers: [
      "10 cm",
      "20 cm",
      "2.5 cm"
    ],
    category: "Maths"
  },

  //----General Knowledge Questions----
  {
    question: "What is the largest ocean on Earth?",
    correctAnswer: "Pacific Ocean",
    incorrectAnswers: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean"
    ],
    category: "General Knowledge"
  },
  {
    question: "Who wrote the play 'Romeo and Juliet'?",
    correctAnswer: "William Shakespeare",
    incorrectAnswers: [
      "Charles Dickens",
      "Jane Austen",
      "Mark Twain"
    ],
    category: "General Knowledge"
  },
  {
    question: "What is the hardest natural substance on Earth?",
    correctAnswer: "Diamond",
    incorrectAnswers: [
      "Gold",
      "Iron",
      "Graphite"
    ],
    category: "General Knowledge"
  },
  {
    question: "In which year did humans first land on the moon?",
    correctAnswer: "1969",
    incorrectAnswers: [
      "1965",
      "1970",
      "1959"
    ],
    category: "General Knowledge"
  },

  //-----Sports Questions----
  {
    question: "Which country won the FIFA World Cup in 2018?",
    correctAnswer: "France",
    incorrectAnswers: [
      "Germany",
      "Brazil",
      "Argentina"
    ],
    category: "Sports"
  },
  {
    question: "What is the national sport of Japan?",
    correctAnswer: "Sumo Wrestling",
    incorrectAnswers: [
      "Baseball",
      "Karate",
      "Judo"
    ],
    category: "Sports"
  },
  {
    question: "How long is an Olympic swimming pool?",
    correctAnswer: "50 meters",
    incorrectAnswers: [
      "25 meters",
      "100 meters",
      "75 meters"
    ],
    category: "Sports"
  },
  {
    question: "How many points is a touchdown worth in American football?",
    correctAnswer: "6",
    incorrectAnswers: [
      "3",
      "7",
      "5"
    ],
    category: "Sports"
  }
];


async function addQuestions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Question.deleteMany({});
    console.log('Cleared existing questions');

    const result = await Question.insertMany(questions);
    console.log(`Added ${result.length} questions successfully`);

    mongoose.connection.close();
  } catch (error) {

    console.error('Error:', error);
    mongoose.connection.close();
  }
}

addQuestions();