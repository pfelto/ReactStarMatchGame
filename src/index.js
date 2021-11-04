import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const PlayAgain = ({clickHandler, gameStatus}) => {
  return(
    <div className='game-done'>
      <div className='message'>
        You {gameStatus.toUpperCase()}!
      </div>
      <button onClick={clickHandler}>Play Again!</button>
    </div>
  );
}

const StarsDisplay = ({count}) => (
  <>
    {utils.range(1,count).map((starId) => 
      <div key={starId} className='star'></div>
    )}
  </>
)

//PlayButton Component
const PlayButton = ({number, status, clickHandler}) => (
  <button 
    onClick={() => clickHandler(number, status)} 
    className="number"
    style={{backgroundColor: colors[status]}}>
      {number}
  </button>
);

//Custom Hook
const useGameState = () => {
  const [stars, setStars] = React.useState(utils.random(1,9));
  const [candidateNums, setCandidateNums] = React.useState([]);
  const [availableNums, setAvailableNums] = React.useState(utils.range(1,9));
  const [secondsLeft, setSecondsLeft] = React.useState(10)

  useEffect(() => {
    if(secondsLeft > 0 && availableNums.length > 0){
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }

  });

  const setGameState = (newCandidateNums) => {
    if(utils.sum(newCandidateNums) !== stars){
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter((num) => {
        return (newCandidateNums.includes(num)) ? false : true;
      });
      //redraw number of stars (only playable ones) randomSumIn
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  }  

  return {stars, availableNums, candidateNums, secondsLeft, setGameState };
}



// STAR MATCH - Starting Template
const Game = ({startNewGame}) => {

  const {stars, availableNums, candidateNums, secondsLeft, setGameState } = useGameState();

  const candidateAreWrong = utils.sum(candidateNums) > stars;

  const gameStatus = availableNums.length === 0
    ? 'won'
    : secondsLeft === 0 ? 'lost' : 'active'

  //numberStatus function
  const numberStatus = (number) => {
    if(!availableNums.includes(number)) {
      return 'used';
    }
    if(candidateNums.includes(number)) {
      return candidateAreWrong ? 'wrong' : 'candidate';
    }
    return 'available';
  }

  const onNumberClick = (number,status) => {
    // currentStatus (status from numberStatus) => newStatus
    if(status === 'used' || gameStatus !== 'active'){
      return;
    }

    //CandidateNums
    const newCandidateNums = 
      status === 'available'
      ?  [...candidateNums,number]
      : candidateNums.filter(cn => cn !== number);
    
    setGameState(newCandidateNums);

  }




  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {
            gameStatus !== 'active'
            ? <PlayAgain clickHandler={startNewGame} gameStatus={gameStatus}/> 
            : <StarsDisplay count={stars} />
          }
        </div>
        <div className="right">
        {utils.range(1,9).map((number) => 
            <PlayButton 
            key={number}  
            status={numberStatus(number)}
            number={number}  
            clickHandler={onNumberClick}
            />
        )}
          
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

//Game Component
const StarMatch = () => {
  const [gameId, setGameId] = React.useState(0);
  return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)}/> 
}


// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};


// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

const root = document.getElementById('root');
ReactDOM.render(
  <StarMatch />
  , root);
