import { useState, useEffect, SetStateAction } from 'react';
import Editor from '@monaco-editor/react';
import Frame from 'react-frame-component';
import Sandbox from './Coding/Sandbox';
import CodeInsights from './Coding/CodeInsights';
import CodeFooter from './Coding/CodeFooter';
import ProblemCard from './Coding/ProblemCard';
import Navbar from '../Components/Navbar';

import {
  problem1,
  problem2,
  problem3,
  problem4,
  problem5,
  problem6,
  problem7,
} from './Coding/problems';
import { useParams } from 'react-router-dom';

const level: Dict = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
  all: 5,
};

function Coding() {
  // const [user, setUser] = useState<any>();
  const [userInput, setUserInput] = useState<string | undefined>('');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [problem, setProblem] = useState<Problem>();
  const [error, setError] = useState<string>('');
  const [solved, setSolved] = useState<boolean | string>(false);
  const [number, setNumber] = useState<number | undefined>();
  const [tests, setTests] = useState<number>(0);
  const [solveTime, setSolveTime] = useState<number>(0);
  const [runtime, setRuntime] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [safelyRunCode, setSafelyRunCode] = useState<boolean>(false);
  const [results, setResults] = useState<Result[]>([]);
  const { levelId, problemId } = useParams();

  useEffect(() => {
    const fetchData = async (receivedProblems: Problem[]) => {
      // const receivedProblems = await apiService.getProblems();
      // const user = await apiService.getUser();
      // setUser(user);

      // filter out problems that are not solved
      // const filteredProblems = receivedProblems.filter(
      // (problem) => !user.solutions.map((solution) => solution.problemId)
      // .includes(problem._id)
      // );

      // sort by level
      // receivedProblems.sort((a, b) => a.level - b.level);

      if (levelId && levelId !== 'all') {
        // filter by level
        const filteredProblems = receivedProblems.filter(
          (problem) => problem.level === level[levelId]
        );
        setProblems(filteredProblems);
      } else if (levelId && levelId === 'all') {
        // shuffle problems
        for (let i = receivedProblems.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [receivedProblems[i], receivedProblems[j]] = [
            receivedProblems[j],
            receivedProblems[i],
          ];
        }
        setProblems(receivedProblems);
      } else if (problemId) {
        // filter by problemId
        const filteredProblems = receivedProblems.filter(
          (problem) => problem.name === problemId
        );
        setProblems(filteredProblems);
      } else setProblems(receivedProblems);
    };

    fetchData([
      problem1,
      problem2,
      problem3,
      problem4,
      problem5,
      problem6,
      problem7,
    ]);

    setNumber(0);
  }, []);

  useEffect(() => {
    // Change problem when number increases
    if ((number as number) < problems.length) {
      setError('');
      setSolved('');
      setRuntime(0);
      setResults([]);
      setSolveTime(performance.now());
      setProblem(problems[number as number]);
      setUserInput(problem?.function);
    }
  }, [number]);

  useEffect(() => {
    // Check if user solved problem
    if (results.length === 3) {
      setSafelyRunCode(false);

      const { runtime: runtime1, output: output1, error: error1 } = results[0];
      const { runtime: runtime2, output: output2, error: error2 } = results[1];
      const { runtime: runtime3, output: output3, error: error3 } = results[2];

      const testsPassed =
        (output1 === problem?.solution1[1] ? 1 : 0) +
        (output2 === problem?.solution2[1] ? 1 : 0) +
        (output3 === problem?.solution3[1] ? 1 : 0);

      setTests(testsPassed);

      if (testsPassed === 3) {
        const endTime = performance.now();
        const averageTime = (runtime1 + runtime2 + runtime3) / 3;
        setSolveTime(endTime - solveTime);
        setRuntime(averageTime);
        if (!solved) setScore((prevScore) => prevScore + 100);
        setSolved(true);
        setError('');
      }

      if (error1 || error2 || error3) {
        if (solved) setScore((prevScore) => prevScore - 100);
        if (error1) setError(error1);
        else if (error2) setError(error2);
        else if (error3) setError(error3);
        setSolved(false);
      }

      if (testsPassed < 3 && !error1 && !error2 && !error3) {
        if (solved) setScore((prevScore: number) => prevScore - 100);
        setError('');
        setSolved(false);
      }
    }
  }, [results]);

  const handleNext = () => {
    //save solution to db
    // apiService.saveSolution({
    //   userId: user._id,
    //   problemId: problem._id,
    //   solution: problem.function,
    //   score: score,
    //   runtime: number,
    //   solveTime: number
    // });
    setNumber((prevNumber) => (prevNumber as number) + 1);
  };

  const handleChange = (input: SetStateAction<string | undefined>) => {
    setUserInput(input);
  };

  const runCode = () => {
    setTests(0);
    setSafelyRunCode(true);
  };

  return (
    <div className='h-screen w-full transition duration-200 ease-in-out  bg-seasalt' >
      <Navbar />
      <div className='p-20' >
        {problem && (number as number) < problems.length && (
          <div className='flex items-center justify-center h-full w-full'>
            <ProblemCard
              problem={problem}
              score={score}
              tests={tests}
              solved={solved}
              error={error}
              runtime={runtime}
              solveTime={solveTime}
            />

            <div className='mx-4 text-center w-3/4'>
              <Editor
                className='border p-0.5 pt-5 pr-2 border-teal-600 rounded-md bg-white'
                height='65vh'
                defaultLanguage={problem.language}
                theme='vs-light'
                value={problem.function}
                onChange={handleChange}
                options={{
                  minimap: {
                    enabled: false,
                  },
                  wordWrap: 'on',
                  tabSize: 2,
                }}
              />

              <CodeFooter
                problems={problems}
                number={number}
                runCode={runCode}
                solved={solved}
                handleNext={handleNext}
              />
            </div>
          </div>
        )}
        {number === problems.length && (
          <CodeInsights problems={problems} score={score} />
        )}
        <div style={{ display: 'none' }}>
          <Frame>
            <Sandbox
              userInput={userInput}
              problem={problem}
              safelyRunCode={safelyRunCode}
              onResult={(receivedResults: Result[]) =>
                setResults(receivedResults)
              }
            />
          </Frame>
        </div>
      </div>
    </div>
  );
}

export default Coding;
