export type listData = {
  id: string;
  name: string;
}[];

export type timeFrame = 'week' | 'month' | 'year';

export type productPerformance = {
  name: string;
  data: {
    name: string;
    value: number;
  }[];
}[];

export type CustomerInsights = {
  name: string;
  value: [number, number];
}[][];
