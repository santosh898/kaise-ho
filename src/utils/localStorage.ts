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
  return allWeeks[thisWeekIndex].attributes;
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

function generateRandomAttributes(): Record<string, number> {
  const dummyAttributes: Record<string, number> = {};
  const attributeKeys = [
    "Money",
    "Sex",
    "Sleep",
    "Motivation",
    "Work",
    "Diet",
    "Exercise",
    "Substance Use",
    "Emotional Balance",
  ];

  for (const key of attributeKeys) {
    dummyAttributes[key] = getRandomInt(0, 10);
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
      attributes: generateRandomAttributes(),
      date: formattedDate,
    });
  }

  localStorage.setItem("updates", JSON.stringify(updates.reverse()));
};
