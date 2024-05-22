import React, { useState } from "react";
import { Container, VStack, Text, Button, Input, Box, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
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
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

      const splitDataframes = splitIntoDataframes(worksheet);
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
        <Text fontSize="2xl" fontWeight="bold">Split Dataframe Tool</Text>
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        {dataframes.length > 0 && (
          <Box width="100%">
            {dataframes.map((dataframe, index) => (
              <Box key={index} my={4} p={4} borderWidth="1px" borderRadius="lg">
                <Text fontSize="lg" fontWeight="bold">Dataframe {index + 1}</Text>
                <Table variant="simple" size="sm">
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
              </Box>
            ))}
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Index;