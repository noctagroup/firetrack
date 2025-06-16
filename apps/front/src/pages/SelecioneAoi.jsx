import {
  Box,
  Container,
  Typography
} from '@mui/material';
import { useFiretrack } from '../store/FiretrackContext';
import { useState } from 'react';
import { MapContainer, TileLayer, Rectangle, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import BaseNavigationButtons from '../components/BaseNavigationButtons';
import { useNavigate } from 'react-router-dom';

function BBoxSelector({ clickedLatLon, onChange, onAoiChoosen }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      if (!clickedLatLon) {
        onChange([lat, lng]);
      } else {
        const [lat1, lon1] = clickedLatLon;
        const minLat = Math.min(lat1, lat);
        const maxLat = Math.max(lat1, lat);
        const minLon = Math.min(lon1, lng);
        const maxLon = Math.max(lon1, lng);

        onAoiChoosen([
          [minLat, minLon],
          [maxLat, maxLon]
        ]);

        onChange(null);
      }
    }
  });
  return null;
}

export default function SelecioneAOI() {
  const { aoi, setAoi } = useFiretrack();
  const navigate = useNavigate();
  const [clickedLatLon, setClickedLatLon] = useState(null);

  const handleNext = () => {
    navigate('/confirmar');
  };

  const handlePrevious = () => {
    navigate('/selecione-periodo')
  }

  const bounds = aoi.length === 2 ? aoi : null;

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container>
        <Typography variant="h6" color="primary" mb={4}>
          3. Selecione a área de interesse (clique duas vezes para selecionar a área)
        </Typography>

        <Box sx={{ height: 500, width: '100%', mb: 4 }}>
          <MapContainer
            center={[-12.5, -52.5]}
            zoom={5}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
            doubleClickZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {bounds && <Rectangle bounds={bounds} pathOptions={{ color: 'blue' }} />}
            {clickedLatLon && <Marker position={clickedLatLon} />} 
            <BBoxSelector
              clickedLatLon={clickedLatLon}
              onChange={setClickedLatLon}
              onAoiChoosen={setAoi}
            />
          </MapContainer>
        </Box>

        <BaseNavigationButtons
          hasToStart
          nextHandler={handleNext}
          previousHandler={handlePrevious}
          nextValidator={aoi.length !== 2}
        />
      </Container>
    </Box>
  );
}
