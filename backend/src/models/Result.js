import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    answers: [
      {
        question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        answer: { type: Number }, // index of chosen option
        correct: { type: Boolean },
      }
    ],
    score: { type: Number },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

const Result = mongoose.model('Result', resultSchema);
export default Result;
