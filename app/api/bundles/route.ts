```typescript
import { NextResponse } from 'next/server';
import bundlesData from '../../../data/bundles.json';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const room = searchParams.get('room');

    let filteredBundles = bundlesData;

    if (room && room !== 'All Rooms') {
        filteredBundles = bundlesData.filter((bundle: any) => bundle.room === room);
    }

    return NextResponse.json(filteredBundles);
}
```
