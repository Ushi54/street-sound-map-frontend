'use client';
import { Box, TextField, Button } from '@mui/material';

export default function SearchForm() {
  return (
    <Box component="form" sx={{ mt: 4, display: 'flex', gap: 2 }}>
      <TextField label="エリア" variant="outlined" size="small" />
      <TextField label="キーワード" variant="outlined" size="small" />
      <Button variant="contained" type="submit">検索</Button>
    </Box>
  );
}
