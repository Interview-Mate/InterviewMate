import { mongoose } from './index.models';

const interviewSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
    company: String,
    field: String,
    title: String,
  date: {
    type: Date, default: () => Date.now()
   },

  conversation: [{
      role: String,
      feedback: String, //?
      rating: Number,   //?
      next_question: String, //?
      cloudinary_url: String,
      content: String,
    },
  ],
    overall_score: Number,
  });


const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
