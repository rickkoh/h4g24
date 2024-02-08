import { UploadFile } from "antd";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

const CsvDataContext = createContext({
  csvData: undefined as UploadFile | undefined,
  setCsvData: (file: UploadFile) => {},
});

export const useCsvDataContext = () => useContext(CsvDataContext);

export const CsvDataProvider = (props: PropsWithChildren) => {
  const [csvData, setCsvData] = useState<UploadFile>();

  return (
    <CsvDataContext.Provider value={{ csvData, setCsvData }}>
      {props.children}
    </CsvDataContext.Provider>
  );
};
