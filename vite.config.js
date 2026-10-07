import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/planespotters': {
        target: 'https://api.planespotters.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/planespotters/, '/pub/photos'),
        headers: {
          'User-Agent': 'FlightRadarAvionics/1.0 (https://flightcontroller.vercel.app; contact@flightcontroller.app)'
        }
      },
      '/api': {
        target: 'https://opensky-network.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      '/hexdb': {
        target: 'https://hexdb.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hexdb/, '')
      },
      '/metar': {
        target: 'https://aviationweather.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/metar/, '/api/data/metar')
      }
    }
  }
});
