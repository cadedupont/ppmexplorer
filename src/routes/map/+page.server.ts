export const load = async () => {
  try {
    const regions = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9'];
    const responses = (
      await Promise.all(
        regions.map((endpoint) =>
          fetch(`https://api.p-lod.org/geojson/${endpoint}`).then((response) => response.json())
        )
      )
    ).filter((data) => data !== null);
    return {
      type: 'FeatureCollection',
      features: responses
    };
  } catch (err) {
    console.error('Error fetching GeoJSON data:', err);
  }
};
