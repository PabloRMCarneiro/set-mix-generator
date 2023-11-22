export const camelotMajorKeyDict: { [key: number]: string } = {
  "0": "8",
  "1": "3",
  "2": "10",
  "3": "5",
  "4": "12",
  "5": "7",
  "6": "2",
  "7": "9",
  "8": "4",
  "9": "11",
  "10": "6",
  "11": "1",
};

export const camelotMinorKeyDict: { [key: number]: string } = {
  "0": "5",
  "1": "12",
  "2": "7",
  "3": "2",
  "4": "9",
  "5": "4",
  "6": "11",
  "7": "6",
  "8": "1",
  "9": "8",
  "10": "3",
  "11": "10",
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
}

export function spotify2Camelot(key: number, mode: number) {
  let result: string = "";
  if (mode) {
    result = `${camelotMajorKeyDict[key]}B`;
  } else {
    result = `${camelotMinorKeyDict[key]}A`;
  }
  return result;
}

export function s2c(key: number, mode: number) {
  let result: string = "";
  if (mode) {
    result = `${camelotMajorKeyDict[key]}`;
  } else {
    result = `${camelotMinorKeyDict[key]}`;
  }
  return Number(result);
}

export const typeOfMix: {
  [key: string]: {
    keyPlus: number;
    modeShift: boolean;
  };
} = {
  "perfect-mix": {
    keyPlus: 0,
    modeShift: false,
  },
  "minus-mix": {
    keyPlus: -1,
    modeShift: false,
  },
  "plus-mix": {
    keyPlus: 1,
    modeShift: false,
  },
  "energy-boost": {
    keyPlus: 2,
    modeShift: false,
  },
  "scale-change": {
    keyPlus: 0,
    modeShift: true,
  },
  "diagonal-mix": {
    keyPlus: -1, // se for Maior o mode é +1
    modeShift: true,
  },
  "jaws-mix": {
    keyPlus: 7, // procurar um jeito de entrar no conjunto
    modeShift: false,
  },
  "none": {
    keyPlus: 13,
    modeShift: false,
  }
};

export const typeOfBPMRange: {
  [key: string]: () => [number, number];
} = {
  two: () => [-2, 2],
  five: () => [-5, 5],
  ten: () => [-10, 10],
  "plus-ten": () => [
    Math.floor(Math.random() * 90 + -100),
    Math.floor(Math.random() * 91 + 10),
  ],
};

export const convertTime = (ms: number) => {
  // retornar {minutos, segundos}
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
};

export const structTypeOfMix = [
  {
    value: "perfect-mix",
    name: "Perfect Mix",
    description: "Find the same key and mode",
  },
  {
    value: "minus-mix",
    name: "-1 Mix",
    description: "Find the key -1 and the same mode",
  },
  {
    value: "plus-mix",
    name: "+1 Mix",
    description: "Find the key +1 and the same mode",
  },
  {
    value: "energy-boost",
    name: "Energy Boost",
    description: "Find the key +2 and the same mode",
  },
  {
    value: "scale-change",
    name: "Scale Change",
    description: "Find the same key and change the mode",
  },
  {
    value: "diagonal-mix",
    name: "Diagonal Mix",
    description:
      "Find the key +3 and chage the mode if it is Minor or find the key -3 and change the mode if it is Major",
  },
  {
    value: "jaws-mix",
    name: "Jaw's Mix",
    description: "Find the key +7 and the same mode",
  },
  {
    value: "none",
    name: "None",
    description: "Does not take into account the resonance of the music", // não leva em consideração a tonalidade da música
  },
];

export const structTypeOfBPMRange = [
  {
    value: "two",
    name: "± 2 BPM",
    description:
      "Find between the sequence from the current BPM -2 to the current BPM +2",
  },
  {
    value: "five",
    name: "± 5 BPM",
    description:
      "Find between the sequence from the current BPM -5 to the current BPM +5",
  },
  {
    value: "ten",
    name: "± 10 BPM",
    description:
      "Find between the sequence from the current BPM -10 to the current BPM +10",
  },
  {
    value: "plus-ten",
    name: ">± 10 BPM",
    description:
      "Find between the sequence from the current BPM - random number between 100 and 10 to the current BPM + random number between 10 and 100",
  },
];

export const featuresChoseNames = [
  "Energy",
  "Danceability",
  "Instrumental",
  "Valence",
  "Popularity",
];

export const featuresChoseNamesDesciptions = [
  "Energy is a measure from 0 to 100 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.",
  "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0 is least danceable and 100 is most danceable.",
  "Predicts whether a track contains no vocals. 'Ooh' and 'aah' sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly 'vocal'. The closer the instrumentalness value is to 100, the greater likelihood the track contains no vocal content. Values above 50 are intended to represent instrumental tracks, but confidence is higher as the value approaches 100.",
  "A measure from 0 to 100 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).",
  "The popularity of the track. The value will be between 0 and 100, with 100 being the most popular.",
];
