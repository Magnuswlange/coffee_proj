export type Drink = {
  id: number;
  title: string;
  desc: string;
  volumeMl: number;
  cupSize: CupSize;
  isHot: boolean;
  sweetness: 1 | 2 | 3 | 4 | 5;
  intensity: 1 | 2 | 3 | 4 | 5;
  popular: boolean;
};

type CupSize = "small" | "medium" | "large";
