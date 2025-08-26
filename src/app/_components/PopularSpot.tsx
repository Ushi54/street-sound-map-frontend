// PopularSpot.tsx
'use client';
import { Card, CardContent, Typography } from '@mui/material';

type Spot = {
  id: string;
  name: string;
  description: string;
  address: string;
  distanceKm: number;
};

export default function PopularSpot({ spot }: { spot: Spot }) {
  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h6">人気の練習場所</Typography>
        <Typography variant="subtitle1">
          {spot.name}（{spot.address}）
        </Typography>
        <Typography variant="body2">{spot.description}</Typography>
      </CardContent>
    </Card>
  );
}
