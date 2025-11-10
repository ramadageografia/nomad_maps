
# Nomad-Maps (Prepared package)

Site multi-page (Home, Destinos, Sobre, Contato) prepared for GitHub Pages.
Structure:
- index.html (home)
- destinos.html
- sobre.html
- contato.html
- Assets/CSS/style.css
- Assets/Imagens/ (logo and banner included)
- Assets/JS/maps.js (Leaflet + Plotly initialization)

How to publish:
1. Upload the entire folder contents to the root of the GitHub repository `Nomad-Maps`.
2. In GitHub > Settings > Pages select Branch `main` and folder `/ (root)`.
3. Wait a minute — site will be published at: https://<your-username>.github.io/Nomad-Maps/

Notes:
- Replace placeholder festival data in Assets/JS/maps.js with your full dataset or connect to external JSON/CSV.
- You'll later provide the collab for the Plotly graph — keep `plotlyData` variable in maps.js ready to accept it.
