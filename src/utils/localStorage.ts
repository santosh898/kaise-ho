import {
  startOfWeek,
  parseISO,
  isSameDay,
  formatISO,
  subWeeks,
} from "date-fns";

export interface Update {
  attributes: Record<string, number>;
  date: string;
}

const attributeKeys = [
  "Money",
  "Sex",
  "Sleep",
  "Motivation",
  "Work",
  "Diet",
  "Fitness Mind & Body",
  "Substance Use",
  "Emotional Balance",
];

const findThisWeekIndex: (allWeeks: Update[]) => [number, Date] = (
  allWeeks
) => {
  const today = new Date(); // Get today's date
  const lastSunday = startOfWeek(today, { weekStartsOn: 0 });
  return [
    allWeeks.findIndex((week) => isSameDay(parseISO(week.date), lastSunday)),
    lastSunday,
  ];
};

export const getAllWeeks = () => {
  return JSON.parse(localStorage.getItem("updates") ?? "[]") as Update[];
};

export const getThisWeek = () => {
  const allWeeks = getAllWeeks();
  const [thisWeekIndex] = findThisWeekIndex(allWeeks);
  if (thisWeekIndex > -1) return allWeeks[thisWeekIndex].attributes;
  return generateDefaultAttributes();
};

export const updateThisWeek = (attributes: Update["attributes"]) => {
  const allWeeks = getAllWeeks();

  const [thisWeekIndex, lastSunday] = findThisWeekIndex(allWeeks);

  if (thisWeekIndex > -1) {
    allWeeks[thisWeekIndex] = { attributes, date: formatISO(lastSunday) };
  } else {
    allWeeks.push({ attributes, date: formatISO(lastSunday) });
  }
  localStorage.setItem("updates", JSON.stringify(allWeeks));
};

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDefaultAttributes(random = false): Record<string, number> {
  const dummyAttributes: Record<string, number> = {};

  for (const key of attributeKeys) {
    dummyAttributes[key] = random ? getRandomInt(0, 10) : 0;
  }
  return dummyAttributes;
}

export const fillDummyData: () => void = () => {
  const updates: Update[] = [];
  let currentDate = new Date();

  for (let i = 0; i < 10; i++) {
    const sunday = startOfWeek(subWeeks(currentDate, i), { weekStartsOn: 0 });
    const formattedDate = formatISO(sunday);

    updates.push({
      attributes: generateDefaultAttributes(true),
      date: formattedDate,
    });
  }

  localStorage.setItem("updates", JSON.stringify(updates.reverse()));
};
