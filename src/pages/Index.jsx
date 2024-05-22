import React, { useState } from "react";
import { Container, VStack, Text, Button, Input, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import * as XLSX from "xlsx";

const Index = () => {
  const [dataframes, setDataframes] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const splitDataframes = splitIntoDataframes(json);
      setDataframes(splitDataframes);
    };

    reader.readAsArrayBuffer(file);
  };

  const splitIntoDataframes = (data) => {
    const dataframes = [];
    let currentDataframe = [];

    data.forEach((row) => {
      if (row.every((cell) => cell === null || cell === "")) {
        if (currentDataframe.length > 0) {
          dataframes.push(currentDataframe);
          currentDataframe = [];
        }
      } else {
        currentDataframe.push(row);
      }
    });

    if (currentDataframe.length > 0) {
      dataframes.push(currentDataframe);
    }

    return dataframes;
  };

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl" fontWeight="bold">Dataframe Splitter</Text>
        <Input type="file" accept=".csv,.xlsx" onChange={handleFileUpload} />
        {dataframes.map((dataframe, index) => (
          <Table variant="simple" key={index} my={4}>
            <Thead>
              <Tr>
                {dataframe[0].map((cell, cellIndex) => (
                  <Th key={cellIndex}>{cell}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {dataframe.slice(1).map((row, rowIndex) => (
                <Tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <Td key={cellIndex}>{cell}</Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;