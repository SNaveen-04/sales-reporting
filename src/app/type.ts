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

export type customerInsightsData = {
  name: string;
  value: number;
}[];

export type crossSellingProducts = {
  name: string;
  data: {
    name: string;
    department: string;
    value: number;
  }[];
}[];

export type crossSellingProductsData = {
  name: string;
  department: string;
  value: number;
}[];
