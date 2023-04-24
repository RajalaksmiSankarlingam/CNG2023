import ForgeUI, { Table, Head, Cell, Row } from '@forge/ui';
import React from 'react'

const storyTable = () => {
  return (
   <Table>
      <Head>
        <Cell>Column 1</Cell>
        <Cell>Column 2</Cell>
        <Cell>Column 3</Cell>
        <Cell>Column 4</Cell>
      </Head>
      <Row>
        <Cell>Row 1, Cell 1</Cell>
        <Cell>Row 1, Cell 2</Cell>
        <Cell>Row 1, Cell 3</Cell>
        <Cell>Row 1, Cell 4</Cell>
      </Row>
      <Row>
        <Cell>Row 2, Cell 1</Cell>
        <Cell>Row 2, Cell 2</Cell>
        <Cell>Row 2, Cell 3</Cell>
        <Cell>Row 2, Cell 4</Cell>
      </Row>
    </Table>
  )
}

export default storyTable