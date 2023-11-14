import './App.css'
import DATA_M from '../public/coffeeshops.json'
import DATA_N from '../public/bars.json'
import DATA_O from '../public/restaurants.json'
import Map from 'react-map-gl'
import DeckGL from '@deck.gl/react';
import MapLibreGL from 'maplibre-gl';
import {HexagonLayer, HeatmapLayer} from '@deck.gl/aggregation-layers'
import { AmbientLight, PointLight, LightingEffect} from '@deck.gl/core'
import { useState } from 'react';


const MAP_STYLE2 = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
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
// export const colorRange = [
//   [178,24,43],
//   [239,138,98],
//   [253,219,199],
//   [209,229,240],
//   [103,169,207],
//   [33,102,172]
// ];

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
    ${count} Locals`;
}


function App() {
  const data_h = DATA_M.map(d=>[Number(d.lng),Number(d.lat),Number(d.weight)])
  const data_j = DATA_N.map(d=>[Number(d.lng),Number(d.lat),Number(d.weight)])
  const data_k = DATA_O.map(d=>[Number(d.lng),Number(d.lat),Number(d.weight)])
  const [isToggled, setIsToggled] = useState(false); 
  const [isToggled2, setIsToggled2] = useState(false); 
  const [dataTitle, setDataTitle] = useState("Coffee Shops");
  const [dataMap, setDataMap] = useState(data_h)
 
    const options = [
       {name:"Coffee shops", dataset:data_h},
       {name:"Bars", dataset:data_j},
       {name:"Restaurants", dataset:data_k}
    ]
    const onOptionChangeHandler = (event) => {
        switch (event.target.value){
          case "Coffee shops":
            setDataMap(data_h)
            break
          case "Bars":
            setDataMap(data_j)
            break  
          case "Restaurants":
            setDataMap(data_k)
            break
        }

        setDataTitle(event.target.value)

    };

  const layers = [
    new HexagonLayer({
      id: 'hexagon-layer',
      colorRange,
      coverage:1,
      data:dataMap,
      elevationRange: [0, 3000],
      elevationScale: dataMap && dataMap?.length ? 50 : 0,
      extruded: true,
      getPosition: d => d,
      pickable: true,
      radius:1000,
      upperPercentile:800,
      material,

      transitions: {
        elevationScale: 3000
      }
    })
  ] 

  const layers2= [
    new HeatmapLayer({
      data:dataMap,
      colorRange:colorRange,
      id: 'heatmp-layer',
      pickable: false,
      getPosition: d => [d[0], d[1]],
      getWeight: d => d[2],
      radiusPixels:10,
      intensity:1,
      threshold:0.03
    })]

  return (
    <>
    <div className={'selectorT'}>
       <select onChange={onOptionChangeHandler}>  
                {options.map((option, index) => {
                    return (
                        <option key={index}>
                            {option.name}
                        </option>
                    );
                })}
        </select>
      
    </div>
    
    <div className='containerBT'>
    <button className={isToggled ? 'buttonT' : 'buttonB'} onClick={() => setIsToggled(!isToggled)}>
         {isToggled ? 'Dark' : 'Light'}
   </button>
    <button className={isToggled ? 'buttonT' : 'buttonB'} onClick={() => setIsToggled2(!isToggled2)}>
         {isToggled2 ? 'Heatmap' : 'Hexagon'}
   </button>
   </div>
    <DeckGL
      initialViewState = {INITIAL_VIEW_STATE}
      controller= {true}
      layers = {isToggled2 ? layers2 : layers}
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
