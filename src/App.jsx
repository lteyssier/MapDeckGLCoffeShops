import './App.css'
import DATA_M from '../public/cafeterias.json'
import DATA_N from '../public/cafeterias_H1.json'
import Map from 'react-map-gl'
import DeckGL from '@deck.gl/react';
import MapLibreGL from 'maplibre-gl';
import {HexagonLayer, HeatmapLayer} from '@deck.gl/aggregation-layers'
import { AmbientLight, PointLight, LightingEffect} from '@deck.gl/core'
import { useState } from 'react';


const MAP_STYLE2 = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000]
});

const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight1, pointLight2});

const material = {
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51]
};


const INITIAL_VIEW_STATE = {
  latitude: 23.6345,
  longitude: -99.5527,
  zoom: 5,
  maxZoom: 16,
  pitch: 45,
  bearing: 0
};

export const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];

function getTooltip({object}) {
  if (!object) {
    return null;
  }
  const lat = object.position[1];
  const lng = object.position[0];
  const count = object.points.length;

  return `\
    latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ''}
    longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ''}
    ${count} Cafeterías`;
}


function App() {
  const [isToggled, setIsToggled] = useState(false); 
  const [isToggled2, setIsToggled2] = useState(false); 
  const data_l = DATA_M?.map(d =>[Number(d.lng), Number(d.lat)])
  const data_h = DATA_N.map(d=>[Number(d.lng),Number(d.lat),Number(d.weight)])
  console.log(data_h)
  const layers = [
    new HexagonLayer({
      id: 'hexagon-layer',
      colorRange,
      coverage:1,
      data:data_l,
      elevationRange: [0, 5000],
      elevationScale: data_l && data_l?.length ? 50 : 0,
      extruded: true,
      getPosition: d => d,
      pickable: true,
      radius:900,
      upperPercentile:1000,
      material,

      transitions: {
        elevationScale: 2000
      }
    })
  ] 

  const layers2= [
    new HeatmapLayer({
      data:data_h,
      id: 'heatmp-layer',
      pickable: false,
      getPosition: d => [d[0], d[1]],
      getWeight: d => d[2],
      radiusPixels:30,
      intensity:1,
      threshold:0.03
    })]

  return (
    <>
    <div className={isToggled ? 'titulo active': 'titulo'}>
        Coffee shops
    </div>
    <div className='containerBT'>
    <button className={isToggled ? 'buttonT' : 'buttonB'} onClick={() => setIsToggled(!isToggled)}>
         {isToggled ? 'Dark' : 'Light'}
   </button>
    <button className={isToggled ? 'buttonT' : 'buttonB'} onClick={() => setIsToggled2(!isToggled2)}>
         {isToggled2 ? 'Hexagon' : 'Heatmap'}
   </button>
   </div>
    <DeckGL
      initialViewState = {INITIAL_VIEW_STATE}
      controller= {true}
      layers = {isToggled2 ? layers : layers2}
      effects={[lightingEffect]}
      getTooltip={getTooltip}
      className="mapa"
    >
      <Map mapStyle={isToggled ? MAP_STYLE2: MAP_STYLE} reuseMaps mapLib={MapLibreGL} preventStyleDiffing={true}/>
    </DeckGL>
    </>
  )
}

export default App
