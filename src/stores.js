import { writable } from "svelte/store";

export const rates = writable({
  SINGLE: 15.5,
  DOUBLE: 12.5,
  TRIPLE: 10.0,
});

const defaultChildcare = [
  {
    name: "Monday",
    careEntries: [],
    cost: 0,
  },
  {
    name: "Tuesday",
    careEntries: [],
    cost: 0,
  },
  {
    name: "Wednesday",
    careEntries: [],
    cost: 0,
  },
  {
    name: "Thursday",
    careEntries: [],
    cost: 0,
  },
  {
    name: "Friday",
    careEntries: [],
    cost: 0,
  },
];

export const childcare = writable(defaultChildcare);
