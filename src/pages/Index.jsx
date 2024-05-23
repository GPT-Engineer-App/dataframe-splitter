import React, { useState } from "react";
import { Container, VStack, Text, Button, Input, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

const Index = () => {
  const [dataframes, setDataframes] = useState([]);
  const [error, setError] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        processCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const processCSV = (text) => {
    try {
      const rows = text.split("\n");
      const dataframes = [];
      let currentTable = [];

      rows.forEach((row) => {
        if (row.trim() === "") {
          if (currentTable.length > 0) {
            dataframes.push(currentTable);
            currentTable = [];
          }
        } else {
          currentTable.push(row.split(","));
        }
      });

      if (currentTable.length > 0) {
        dataframes.push(currentTable);
      }

      setDataframes(dataframes);
      setError("");
    } catch (err) {
      setError("Error processing CSV file");
    }
  };

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl" fontWeight="bold">Split Dataframe by Empty Rows</Text>
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        {error && <Text color="red.500">{error}</Text>}
        {dataframes.map((dataframe, index) => (
          <Table variant="simple" key={index} my={4}>
            <Thead>
              <Tr>
                {dataframe[0].map((header, i) => (
                  <Th key={i}>{header}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {dataframe.slice(1).map((row, i) => (
                <Tr key={i}>
                  {row.map((cell, j) => (
                    <Td key={j}>{cell}</Td>
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