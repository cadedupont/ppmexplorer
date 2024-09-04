<script lang="ts">
	import { MapLibre, GeoJSON, FillLayer, LineLayer } from 'svelte-maplibre';
	import { onMount } from 'svelte';

	const regions = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9'];
	const colors = [
		'#bb4758',
		'#af8913',
		'#765a59',
		'#887ba6',
		'#78935a',
		'#1c6c9b',
		'#883d77',
		'#d07f40',
		'#27938f'
	];
	const geojson: any[] = [];

	onMount(async () => {
		try {
			const responses = await Promise.all(
				regions.map((endpoint) =>
					fetch(`https://api.p-lod.org/geojson/${endpoint}`).then((res) => res.json())
				)
			);
			responses.forEach((response, index) => {
				geojson[index] = response;
			});
		} catch (error) {
			console.error('Error fetching GeoJSON data:', error);
		}
	});
</script>

<MapLibre
	style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
	center={[14.4886, 40.751069]}
	zoom={15}
	standardControls
>
	{#each geojson as data, index}
		<GeoJSON {data}>
			<FillLayer
				paint={{
					'fill-color': colors[index],
					'fill-opacity': 0.6
				}}
			/>
			<LineLayer
				paint={{
					'line-color': '#000',
					'line-width': 1
				}}
			/>
		</GeoJSON>
	{/each}
</MapLibre>
