import { useEffect } from 'react';
import { run } from '../../Util/SafeEval';

const Sandbox = ({
  userInput,
  problem,
  safelyRunCode,
  onResult,
}: {
  userInput: string | undefined;
  problem: Problem | undefined;
  safelyRunCode: any;
  onResult: (results: Result[]) => void;
}) => {
  useEffect(() => {
    if (safelyRunCode) {
      const result1 = run(userInput + problem?.solution1[0]);
      const result2 = run(userInput + problem?.solution2[0]);
      const result3 = run(userInput + problem?.solution3[0]);
      onResult([result1, result2, result3]);
    }
  }, [safelyRunCode]);

  return <></>;
};

export default Sandbox;
