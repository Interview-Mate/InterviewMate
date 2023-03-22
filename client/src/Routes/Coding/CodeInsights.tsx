/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  getSolvedProblems,
  getAllSolvedProblems,
  getAllUsers,
} from '../../Util/ApiService';
import { prettifyTime } from '../../Util/CodeEditorHelpers';

const level: Dict = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Expert',
};

const CodeInsights = ({
  problems,
  score,
  user,
}: {
  problems: Problem[];
  score: number;
  user: User | undefined;
}) => {
  const [solvedProblems, setSolvedProblems] = useState<SolvedProblem[]>([]);
  const [allSolvedProblems, setAllSolvedProblems] = useState<SolvedProblem[]>(
    []
  );
  const [usersAverageSolveTime, setUsersAverageSolveTime] = useState<
    number | undefined
  >();
  const [allAverageSolveTimes, setAllAverageSolveTimes] = useState<
    number | undefined
  >();

  useEffect(() => {
    const fetchData = async () => {
      const receivedUsersSolvedProblems = await getSolvedProblems(user!._id);
      setSolvedProblems(receivedUsersSolvedProblems);

      const receivedAllSolvedProblems = await getAllSolvedProblems();
      setAllSolvedProblems(receivedAllSolvedProblems);
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    setUsersAverageSolveTime(
      solvedProblems.reduce((acc, curr) => acc + curr.solveTime, 0) /
        solvedProblems.length
    );

    setAllAverageSolveTimes(
      allSolvedProblems.reduce((acc, curr) => acc + curr.solveTime, 0) /
        allSolvedProblems.length
    );
  }, [allSolvedProblems]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Your progress',
      },
    },
  };


  const labels = [];
  for (let i = 1; i <= solvedProblems.length; i++) {
    labels.push(i);
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Level',
        data: [15, 13, 27, 33, 48, 55, 70],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Solve time',
        data: [50, 30, 46, 23, 38, 21, 25],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <>
      <h1 className='text-2xl text-center text-pink-500 font-bold'>Insights</h1>
      <div
        className='border border-teal-600 rounded-md mt-5 p-4 h-4/5 min-h-max w-full flex flex-col'
        style={{ background: 'rgba(252, 252, 252, 1)' }}
      >
        {solvedProblems.length !== 0 && usersAverageSolveTime !== 0 && (
          <div className='flex flex-row items-center justify-center h-full'>
            <div className='flex flex-col items-center justify-center w-1/4'>
              <h2 className='text-sm '>Completed challenges:</h2>
              <h3 className='text-sm font-bold'>{problems.length}</h3>
              <h2 className='text-sm mt-5'>Score:</h2>
              <h3 className='text-sm font-bold'>{score}</h3>
              <h2 className='text-sm mt-5'>Your level: </h2>
              <h3 className='text-sm font-bold'>
                {
                  level[
                    solvedProblems.reduce(
                      (acc, curr) => acc + curr.exercise!.level,
                      0
                    ) / solvedProblems.length
                  ]
                }
              </h3>
              <h2 className='text-sm mt-5'>Average solve time:</h2>
              {usersAverageSolveTime && (
                <h3 className='text-sm font-bold'>
                  {prettifyTime(usersAverageSolveTime)}
                </h3>
              )}

              <h2 className='text-sm mt-5'>
                Your solve time compared to the average:
              </h2>
              {usersAverageSolveTime && allAverageSolveTimes && (
                <h3 className='text-sm font-bold'>
                  {usersAverageSolveTime < allAverageSolveTimes ? (
                    <span className='text-green-500'>
                      {prettifyTime(
                        allAverageSolveTimes - usersAverageSolveTime
                      )}{' '}
                      faster
                    </span>
                  ) : (
                    <span className='text-red-500'>
                      {prettifyTime(
                        usersAverageSolveTime - allAverageSolveTimes
                      )}{' '}
                      slower
                    </span>
                  )}
                </h3>
              )}
            </div>
            <div className='flex flex-row items-center justify-center  h-full w-2/4 m-5'>
              <Line options={options} data={data} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CodeInsights;
