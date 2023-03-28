import Expand from '../Assets/full-screen.png';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function PastInterview({ interview }: { interview: Interview }) {
  const [expand, setExpand] = useState(false);
  const [averageRating, setAverageRating] = useState([]);
  const [overall, setOverall] = useState();
  const cleanArr = interview.conversation.slice(1);

  useEffect(() => {
    if (cleanArr.length > 0) {
      const avg = cleanArr
        .filter((message: { role: string }) => message.role === 'assistant')
        .slice(1)
        .map((message: { content: any }) => {
          const { content } = message;
          return isJsonString(content)
            ? JSON.parse(content).rating_number
            : null;
        })
        .filter((rating: null) => rating !== null);
      setAverageRating(avg);
      if (interview.overall.length !== 0) {
        if (isJsonString(interview.overall[0])) {
          setOverall(JSON.parse(interview.overall[0]));
        }
      }
    }
  }, []);
  const date = format(new Date(interview.date), 'PPPP');

  function isJsonString(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  return (
    <div className="past-interview">
      <button id="expand-button" onClick={() => setExpand((prev) => !prev)}>
        <img
          src={Expand}
          style={{
            maxWidth: 20,
            marginBottom: 5,
          }}
          alt="Expand the interview and get more detail"
        />
      </button>
      <div className="past-interview-head">
        Your interview for {interview.title} at {interview.company} on {date}
      </div>
      <div
        className='shadow rounded-md mt-5 p-4 h-4/5 min-h-max w-full flex flex-col'
        style={{ background: 'rgba(252, 252, 252, 1)' }}
      >
        {averageRating.length > 0 && (
          <h2 className='text-sm'>
            Average answer rating{' '}
            <span className='text-sm font-bold'>
              {Math.round(
                averageRating.reduce((acc, curr) => acc + curr, 0) /
                  averageRating.length
              )}
            </span>
          </h2>
        )}
        {overall && (
          <>
            <h2 className='text-sm'>
              Overall rating{' '}
              <span className='text-sm font-bold'>
                {overall.overall_number}
              </span>
            </h2>
            <h2 className='text-sm  font-bold'>
              Feedback
              <br />
              <span className='text-sm font-bold'>
                {overall.overall_feedback}
              </span>
            </h2>
            <h2 className='text-sm  font-bold'>
              Suggestions
              <br />
              <span className='text-sm'>{overall.suggestions}</span>
            </h2>
          </>
        )}
      </div>
      <div className='past-interview-body'>
        {expand
          ? cleanArr.map((convo: any, index: number) => (
              <div
                key={index}
                className={index % 2 === 0 ? 'left-convo' : 'right-convo'}
              >
                {isJsonString(convo.content)
                  ? JSON.parse(convo.content).rating_feedback
                  : convo.content
                      .replace(
                        'Rate my response out of 5 with a comment. Then continue to the next question. return this as a JSON object without plus signs in this format {rating_number: input the rating you gave me as a number , rating_feedback: ',
                        ''
                      )
                      .replace(
                        'the feedback you gave me to the previous question ,next_question: your next question}.',
                        ''
                      )}
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
