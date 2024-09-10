export const load = async () => {
  try {
    const responses = (
      await Promise.all(
        ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9'].map((endpoint) =>
          fetch(`https://api.p-lod.org/geojson/${endpoint}`).then((res) => res.json())
        )
      )
    ).filter((response) => response != null);
    return {
      type: 'FeatureCollection',
      features: responses
    };
  } catch (err) {
    console.error('Error fetching GeoJSON data:', err);
  }
};
