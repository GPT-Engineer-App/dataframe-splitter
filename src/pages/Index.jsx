import React, { useState } from "react";
import { Container, VStack, Text, Button, Input, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { read, utils } from "xlsx";

const Index = () => {
  const [dataframes, setDataframes] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = utils.sheet_to_json(sheet, { header: 1 });

      const splitDataframes = splitIntoDataframes(json);
      setDataframes(splitDataframes);
    };
    reader.readAsBinaryString(file);
  };

  const splitIntoDataframes = (data) => {
    const dataframes = [];
    let currentDf = [];
    data.forEach((row) => {
      if (row.every((cell) => cell === null || cell === "")) {
        if (currentDf.length > 0) {
          dataframes.push(currentDf);
          currentDf = [];
        }
      } else {
        currentDf.push(row);
      }
    });
    if (currentDf.length > 0) {
      dataframes.push(currentDf);
    }
    return dataframes;
  };

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">Upload CSV to Split into Dataframes</Text>
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        {dataframes.map((df, index) => (
          <Table variant="simple" key={index} my={4}>
            <Thead>
              <Tr>
                {df[0].map((cell, cellIndex) => (
                  <Th key={cellIndex}>{cell}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {df.slice(1).map((row, rowIndex) => (
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