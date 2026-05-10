import { api } from "@/lib/api";
import SwapApp from "@/components/SwapApp";

// Pre-fetch static catalog data on the server so the client gets it instantly.
export default async function Home() {
  const [seriesList, defects] = await Promise.all([api.series(), api.defects()]);

  return <SwapApp seriesList={seriesList} defects={defects} />;
}
