'use client';
import { Box, TextField, Button, Stack } from '@mui/material';

export default function SearchForm() {
  return (
    <Stack direction="row" component="form" gap={2} mt={4}>
      <TextField label="エリア" variant="outlined" size="small" />
      <TextField label="キーワード" variant="outlined" size="small" />
      <Button variant="contained" type="submit">検索</Button>
    </Stack>
  );
}
