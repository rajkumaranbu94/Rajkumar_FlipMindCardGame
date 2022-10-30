const shuffleArray = (count: number) => {
  let randomArray = Array.from({length: count}, () =>
    1 + Math.floor(Math.random() * 99),
  );

  randomArray.push.apply(randomArray, randomArray);

  randomArray.map(x => [Math.random(), x]).sort(([a], [b]) => a - b).map(([_, x]) => x);

  return randomArray;
};

export {shuffleArray};
