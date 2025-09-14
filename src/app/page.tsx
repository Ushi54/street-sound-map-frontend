// page.tsx
import { Box, Container } from '@mui/material';
import Header from './_components/Header';
import PopularSpot from './_components/PopularSpot';
import SearchForm from './_components/SearchForm';
import { fetchNearby } from './actions/fetchNearby';

export default async function Home() {
  const data = await fetchNearby(35.6895, 139.7006);

  return (
    <Box bgcolor="#b0b0b0ff">
      <Header />
      <Container maxWidth="md">
        {Array.isArray(data) && data.map((spot) => (<PopularSpot key={spot.id} spot={spot} />))}
        <SearchForm />
      </Container>
    </Box>
  );
}
