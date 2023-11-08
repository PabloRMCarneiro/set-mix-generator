export const camelotMajorKeyDict: { [key: number]: string } = {
  '0': '8',
  '1': '3',
  '2': '10',
  '3': '5',
  '4': '12',
  '5': '7',
  '6': '2',
  '7': '9',
  '8': '4',
  '9': '11',
  '10': '6',
  '11': '1',
};

export const camelotMinorKeyDict: { [key: number]: string } = {
  '0': '5',
  '1': '12',
  '2': '7',
  '3': '2',
  '4': '9',
  '5': '4',
  '6': '11',
  '7': '6',
  '8': '1',
  '9': '8',
  '10': '3',
  '11': '10',
};

export function camelot2Spotify(key: string, mode: number) {
  let result: number = -1;
  if (mode) {
      for (const _key in camelotMajorKeyDict) {
          if (camelotMajorKeyDict[_key] == key) {
              result = parseInt(_key);
              break;
          }
      }
  } else {
      for (const _key in camelotMinorKeyDict) {
          if (camelotMinorKeyDict[_key] == key) {
              result = parseInt(_key);
              break;
          }
      }
  }
  return result;
};


export function spotify2Camelot(key: number, mode: number) {
  let result: string = '';
  if (mode) {
    result = `${camelotMajorKeyDict[key]}B`
  } else {
    result = `${camelotMinorKeyDict[key]}A`
  }
  return result;
}

export function s2c(key: number, mode: number) {
  let result: string = '';
  if (mode) {
    result = `${camelotMajorKeyDict[key]}`
  } else {
    result = `${camelotMinorKeyDict[key]}`
  }
  return Number(result);
}



export const typeOfMix: {
  [key: string]: {
    keyPlus: number,
    modeShift: boolean,
  }
} = {

  'perfect-mix': {
    keyPlus: 0,
    modeShift: false,
  },
  'minus-mix': {
    keyPlus: -1,
    modeShift: false,
  },
  'plus-mix': {
    keyPlus: 1,
    modeShift: false,
  },
  'energy-boost': {
    keyPlus: 2,
    modeShift: false,
  },
  'scale-change': {
    keyPlus: 0,
    modeShift: true,
  },
  'diagonal-mix': {
    keyPlus: -1, // se for Maior o mode é +1
    modeShift: true,
  },
  'jaws-mix': {
    keyPlus: 7, // procurar um jeito de entrar no conjunto
    modeShift: false,
  },
}

export const typeOfBPMRange: {
  [key: string]: () => [number, number]
} = {
  'two': () => [-2, 2],
  'five': () => [-5, 5],
  'ten': () => [-10, 10],
  'plus-ten': () => [Math.floor(Math.random() * (90) + (-100)), Math.floor(Math.random() * (91) + 10)],
}

export const convertTime = (ms: number) => { // retornar {minutos, segundos}
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
}


export const structTypeOfMix = [
  {
    value: 'perfect-mix',
    name: 'Perfect Mix',
  },
  {
    value: 'minus-mix',
    name: '-1 Mix',
  },
  {
    value: 'plus-mix',
    name: '+1 Mix',
  },
  {
    value: 'energy-boost',
    name: 'Energy Boost',
  },
  {
    value: 'scale-change',
    name: 'Scale Change',
  },
  {
    value: 'diagonal-mix',
    name: 'Diagonal Mix',
  },
  {
    value: 'jaws-mix',
    name: 'Jaw\'s Mix',
  },
]
                  
export const structTypeOfBPMRange = [
  {
    value: 'two',
    name: '± 2 BPM',
  },
  {
    value: 'five',
    name: '± 5 BPM',
  },
  {
    value: 'ten',
    name: '± 10 BPM',
  },
  {
    value: 'plus-ten',
    name: '>± 10 BPM',
  },
]