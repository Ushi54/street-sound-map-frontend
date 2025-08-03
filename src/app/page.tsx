
import { Container } from '@mui/material';
import Header from './_components/Header';
import PopularSpot from './_components/PopularSpot';
import SearchForm from './_components/SearchForm';

export default function Home() {
  // 仮データ（API連携予定）
  const dummySpot = {
    title: '代々木公園南エリア',
    area: '東京',
    description: '木陰が多く、ドラムやギターの練習に最適な公園です。',
  };

  return (
    <>
      <Header />
      <Container maxWidth="md">
        <PopularSpot spot={dummySpot} />
        <SearchForm />
      </Container>
    </>
  );
}
