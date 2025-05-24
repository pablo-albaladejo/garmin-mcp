export interface GarminActivity {
  date: string;
  steps: number;
}

/**
 * Fetch activity data from Garmin Connect.
 *
 * This implementation uses environment variables `GARMIN_EMAIL` and
 * `GARMIN_PASSWORD` to authenticate. In a real implementation you would
 * use a Garmin Connect API client. Here we return mocked data so the
 * project can run offline.
 */
export async function fetchGarminData(): Promise<GarminActivity[]> {
  const { GARMIN_EMAIL, GARMIN_PASSWORD } = process.env;
  if (!GARMIN_EMAIL || !GARMIN_PASSWORD) {
    throw new Error('GARMIN_EMAIL and GARMIN_PASSWORD must be set');
  }

  // TODO: Replace this mock with calls to an actual Garmin Connect client.
  return [
    {
      date: new Date().toISOString().substring(0, 10),
      steps: 1234,
    },
  ];
}
