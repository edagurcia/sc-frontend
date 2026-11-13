import { useMemo } from "react";

type Props<T> = {
  data: T[];
  text: string;
};

export const useSearch = <T>({ data, text }: Props<T>) => {
  const dataSet = useMemo(() => {
    if (!text) return data;
    const lower = text.toLowerCase();
    return data.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(lower),
    );
  }, [data, text]);

  return { dataSet };
};
