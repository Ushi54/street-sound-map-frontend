// page.tsx
import { Box, Container } from '@mui/material';
import Header from './_components/Header';
import PopularSpot from './_components/PopularSpot';
import SearchForm from './_components/SearchForm';
import { fetchNearby } from './actions/fetchNearby';

export default async function Home() {
  const data = await fetchNearby(35.6895, 139.7006);

  // fetchNearby が配列を返す想定なら先頭だけ渡す or 複数表示にする
  const first = Array.isArray(data) ? data[0] : data;

  return (
    <Box bgcolor="#b0b0b0ff">
      <Header />
      <Container maxWidth="md">
        {first && <PopularSpot spot={first} />}
        <SearchForm />
      </Container>
    </Box>
  );
}
