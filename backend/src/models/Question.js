import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOption: { type: Number, required: true },
    explanation: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    aiGenerated: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Question = mongoose.model('Question', questionSchema);
export default Question;
