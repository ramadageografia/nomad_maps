"""
Nomad Core - manager/app.py
Módulo Streamlit para o Nomad Maps Data Manager (versão 0.1)

Funcionalidades:
- Dashboard (contagens básicas)
- Upload de CSV (salva em data/raw/datatrance_v1.csv)
- Executa o ETL (etl/cleaner.py) via subprocess (usa o mesmo Python)
- Visualização da tabela limpa
- Validação (lista registros com coord_status != ok)
- Mapa interativo via Folium (embed)
- Exportar GeoJSON para data/exports/festivals.geojson

Observações:
- O script chama etl/cleaner.py; ele deve existir em nomadmaps/etl/cleaner.py
- O cleaner.py deve gerar um CSV limpo (datatrance_clean.csv) em output/ ou data/processed/.
- Project layout esperado (relativo a este arquivo):
    nomadmaps/
      manager/app.py  <-- este arquivo
      etl/cleaner.py
      data/raw/
      data/processed/
      data/exports/
      output/
"""

from pathlib import Path
import streamlit as st
import pandas as pd
import subprocess
import sys
import os
import time
import json
import shutil

import folium
from streamlit.components.v1 import html as st_html

# tenta usar streamlit_folium se disponível (melhor interatividade)
try:
    from streamlit_folium import folium_static
    _HAVE_STREAMLIT_FOLIUM = True
except Exception:
    _HAVE_STREAMLIT_FOLIUM = False

# -------------------------------------------
# CONFIGURAÇÕES DE PATHS
# -------------------------------------------
BASE_DIR = Path(__file__).resolve().parents[1]  # project root (nomadmaps/)
DATA_RAW = BASE_DIR / "data" / "raw"
DATA_PROCESSED = BASE_DIR / "data" / "processed"
DATA_EXPORTS = BASE_DIR / "data" / "exports"
OUTPUT_DIR = BASE_DIR / "output"
ETL_SCRIPT = BASE_DIR / "etl" / "cleaner.py"

# nomes esperados
RAW_FILENAME = "datatrance_v1.csv"
CLEAN_CSV_NAMES = [
    DATA_PROCESSED / "datatrance_clean.csv",
    OUTPUT_DIR / "datatrance_clean.csv",
    BASE_DIR / "datatrance_clean.csv",
]

GEOJSON_OUT = DATA_EXPORTS / "festivals.geojson"

# garante pastas
for p in [DATA_RAW, DATA_PROCESSED, DATA_EXPORTS, OUTPUT_DIR]:
    os.makedirs(p, exist_ok=True)


# -------------------------------------------
# UTILIDADES
# -------------------------------------------
def find_cleaned_csv():
    for p in CLEAN_CSV_NAMES:
        if p.exists():
            return p
    return None


@st.cache_data(ttl=60)
def load_cleaned_df():
    path = find_cleaned_csv()
    if not path:
        return None, None
    try:
        df = pd.read_csv(path)
        return df, path
    except Exception as e:
        st.error(f"Erro ao ler CSV limpo em {path}: {e}")
        return None, None


def get_lat_lon_columns(df):
    # detecta colunas de lat/lon suportadas
    lat_keys = ["lat", "latitude", "latitude_extracted", "latitude_extracted"]
    lon_keys = ["lon", "longitude", "longitude_extracted", "longitude_extracted"]
    lat_col = next((c for c in lat_keys if c in df.columns), None)
    lon_col = next((c for c in lon_keys if c in df.columns), None)
    return lat_col, lon_col


def count_valid_coords(df):
    lat_col, lon_col = get_lat_lon_columns(df)
    if not lat_col or not lon_col:
        return 0
    valid = df[lat_col].notna() & df[lon_col].notna()
    return int(valid.sum())


def run_cleaner_subprocess():
    """
    Executa etl/cleaner.py com o mesmo interpretador Python que executa o Streamlit.
    Retorna (sucesso: bool, stdout+stderr: str)
    """
    if not ETL_SCRIPT.exists():
        return False, f"Script ETL não encontrado: {ETL_SCRIPT}"

    cmd = [sys.executable, str(ETL_SCRIPT)]
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, cwd=str(BASE_DIR), check=False)
        output = ""
        if proc.stdout:
            output += proc.stdout
        if proc.stderr:
            output += "\nERR:\n" + proc.stderr
        success = proc.returncode == 0
        # se o cleaner salvou em output/, copie para data/processed para padrão do manager
        out_candidate = OUTPUT_DIR / "datatrance_clean.csv"
        if out_candidate.exists():
            try:
                shutil.copy(out_candidate, DATA_PROCESSED / "datatrance_clean.csv")
            except Exception:
                pass
        return success, output
    except Exception as e:
        return False, str(e)


def create_map(df):
    lat_col, lon_col = get_lat_lon_columns(df)
    if not lat_col or not lon_col:
        # mapa vazio
        m = folium.Map(location=[20, 0], zoom_start=2, tiles="CartoDB positron")
        folium.map.Marker([20, 0], popup="Sem coordenadas válidas").add_to(m)
        return m

    # centro inicial nos centroids (se existir)
    valid = df[df[lat_col].notna() & df[lon_col].notna()]
    if len(valid) == 0:
        m = folium.Map(location=[20, 0], zoom_start=2, tiles="CartoDB positron")
        return m

    try:
        mean_lat = valid[lat_col].astype(float).mean()
        mean_lon = valid[lon_col].astype(float).mean()
    except Exception:
        mean_lat, mean_lon = 20, 0

    m = folium.Map(location=[mean_lat, mean_lon], zoom_start=2, tiles="CartoDB positron")

    # adicionar pontos
    for _, r in valid.iterrows():
        try:
            lat = float(r[lat_col])
            lon = float(r[lon_col])
        except Exception:
            continue

        name = r.get("festival_name") or r.get("name") or "Festival"
        country = r.get("country_en") or r.get("country") or ""
        start = r.get("next_start_date") or ""
        status = r.get("coord_status") or r.get("status") or ""

        # cor por status
        color = "purple"
        if status == "ok":
            color = "green"
        elif status == "error":
            color = "red"
        elif status == "unverified":
            color = "orange"

        popup = folium.Popup(
            folium.IFrame(
                html=f"<b>{name}</b><br>País: {country}<br>Data: {start}<br>Status: {status}",
                width=260,
                height=120,
            ),
            max_width=260
        )

        folium.CircleMarker(
            location=[lat, lon],
            radius=6,
            color=color,
            fill=True,
            fill_color=color,
            fill_opacity=0.85,
            popup=popup
        ).add_to(m)

    return m


def export_geojson(df, out_path: Path):
    lat_col, lon_col = get_lat_lon_columns(df)
    features = []
    for _, r in df.iterrows():
        try:
            lat = r[lat_col]
            lon = r[lon_col]
            if pd.isna(lat) or pd.isna(lon):
                continue
            props = r.dropna().to_dict()
            feat = {"type": "Feature",
                    "geometry": {"type": "Point", "coordinates": [float(lon), float(lat)]},
                    "properties": props}
            features.append(feat)
        except Exception:
            continue
    geo = {"type": "FeatureCollection", "features": features}
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(geo, f, ensure_ascii=False, indent=2)
    return out_path


# -------------------------------------------
# STREAMLIT UI
# -------------------------------------------
st.set_page_config(page_title="Nomad Core — Data Manager", layout="wide", initial_sidebar_state="expanded")

st.sidebar.image(str(BASE_DIR / "assets" / "logo.png") if (BASE_DIR / "assets" / "logo.png").exists() else None, width=180)
st.sidebar.title("Nomad Core")
st.sidebar.caption("Psytrance Travel Agency — Data Manager")

page = st.sidebar.radio("Navegação", ["Dashboard", "Importar CSV", "Validação", "Mapa", "Editor", "Exportar GeoJSON", "Sobre"])

# CARREGAR CSV LIMPO (se existir)
df_clean, csv_path = load_cleaned_df()

# ------- DASHBOARD -------
if page == "Dashboard":
    st.title("Nomad Core — Dashboard")
    st.markdown("Visão geral rápida da base de festivais.")

    col1, col2, col3, col4 = st.columns(4)
    if df_clean is None:
        col1.metric("Festivais", "—")
        col2.metric("Países", "—")
        col3.metric("Continentes", "—")
        col4.metric("Coordenadas válidas", "—")
        st.info("Nenhum CSV limpo encontrado. Vá em *Importar CSV* e rode o cleaner.")
    else:
        n_fest = len(df_clean)
        n_countries = int(df_clean["country_en"].nunique()) if "country_en" in df_clean.columns else int(df_clean["country"].nunique())
        continents = int(df_clean["continent"].nunique()) if "continent" in df_clean.columns else "—"
        coords_ok = count_valid_coords(df_clean)

        col1.metric("Festivais", n_fest)
        col2.metric("Países", n_countries)
        col3.metric("Continentes", continents)
        col4.metric("Coordenadas válidas", coords_ok)

        st.subheader("Amostra da base limpa")
        st.dataframe(df_clean.head(50))

# ------- IMPORTAR CSV -------
elif page == "Importar CSV":
    st.title("Importar CSV")
    st.markdown("Faça upload do CSV (formato DataTrance). O arquivo será salvo em data/raw/ como datatrance_v1.csv e o `etl/cleaner.py` pode ser executado para processar.")

    uploaded = st.file_uploader("Escolha um arquivo CSV", type=["csv"])
    if uploaded:
        save_path = DATA_RAW / RAW_FILENAME
        with open(save_path, "wb") as f:
            f.write(uploaded.getbuffer())
        st.success(f"Arquivo salvo em: {save_path}")
        st.write("Preview do arquivo carregado:")
        try:
            tmp_df = pd.read_csv(save_path)
            st.dataframe(tmp_df.head(50))
        except Exception as e:
            st.error(f"Erro ao ler CSV enviado: {e}")

    st.markdown("---")
    st.markdown("Executar o pipeline de limpeza (etl/cleaner.py). O script deve existir e gerar datatrance_clean.csv em output/ ou data/processed/.")

    if st.button("Executar Limpeza (rodar cleaner)"):
        with st.spinner("Executando etl/cleaner.py ... isto pode demorar"):
            success, output = run_cleaner_subprocess()
        if success:
            st.success("Cleaner executado com sucesso.")
            st.text_area("Saída do cleaner:", output, height=200)
            # recarregar df
            df_clean, csv_path = load_cleaned_df()
        else:
            st.error("Erro ao executar o cleaner.")
            st.text_area("Saída / erro do cleaner:", output, height=300)

# ------- VALIDAÇÃO -------
elif page == "Validação":
    st.title("Validação Geográfica")
    st.markdown("Lista de registros cuja coord_status não é 'ok'. Você pode validar automaticamente (reverse geocoding) -- atenção ao limite de requisições (Nominatim).")

    if df_clean is None:
        st.info("Primeiro gere o CSV limpo (Importar CSV → Executar Limpeza).")
    else:
        if "coord_status" not in df_clean.columns:
            st.warning("A coluna 'coord_status' não existe. Rode o cleaner com validação ou use a função de validação manual.")
            df_clean["coord_status"] = "unverified"

        flagged = df_clean[df_clean["coord_status"] != "ok"].copy()
        st.write(f"Registros com coord_status != ok: {len(flagged)}")
        st.dataframe(flagged[["festival_name", "country", "country_en", "coord_status"]].head(200))

        st.markdown("---")
        st.markdown("Validação automática (reverse geocoding) — opcional")
        validate_now = st.checkbox("Executar reverse geocoding nos registros sinalizados (rate-limited)")
        max_rows = st.number_input("Máximo de registros a validar nesta execução", value=50, min_value=1, max_value=500)
        if validate_now and st.button("Validar agora"):
            from geopy.geocoders import Nominatim
            geolocator = Nominatim(user_agent="nomad_core_validation")
            updated = 0
            with st.spinner("Validando com Nominatim (1 request / s)..."):
                for idx, row in flagged.head(max_rows).iterrows():
                    latcol, loncol = get_lat_lon_columns(df_clean)
                    if not latcol or not loncol:
                        continue
                    lat = row.get(latcol)
                    lon = row.get(loncol)
                    if pd.isna(lat) or pd.isna(lon):
                        continue
                    try:
                        loc = geolocator.reverse(f"{lat}, {lon}", language="en", timeout=10)
                        country_real = None
                        if loc and loc.raw.get("address"):
                            country_real = loc.raw["address"].get("country")
                        df_clean.at[idx, "country_real"] = country_real
                        # atualizar coord_status
                        if country_real and str(country_real).lower().strip() == str(row.get("country_en", "")).lower().strip():
                            df_clean.at[idx, "coord_status"] = "ok"
                        else:
                            df_clean.at[idx, "coord_status"] = "error"
                        updated += 1
                    except Exception as e:
                        # registra timeout/erro e continua
                        df_clean.at[idx, "country_real"] = "ERROR"
                        df_clean.at[idx, "coord_status"] = "unverified"
                    time.sleep(1.0)
            st.success(f"Validação realizada — registros atualizados: {updated}")
            # salvar CSV processado atualizado
            out = DATA_PROCESSED / "datatrance_clean.csv"
            df_clean.to_csv(out, index=False)
            st.info(f"Arquivo processado atualizado: {out}")

# ------- MAPA -------
elif page == "Mapa":
    st.title("Mapa Interativo")
    st.markdown("Mapa gerado a partir do CSV limpo (datatrance_clean.csv).")

    if df_clean is None:
        st.info("Nenhum CSV limpo encontrado. Gere via Importar CSV → Executar Limpeza.")
    else:
        m = create_map(df_clean)
        st.subheader("Mapa de Festivais")
        if _HAVE_STREAMLIT_FOLIUM:
            folium_static(m, width=1200, height=600)
        else:
            # fallback: renderizar HTML
            html_str = m.get_root().render()
            st_html(html_str, height=600)

# ------- EDITOR -------
elif page == "Editor":
    st.title("Editor de Festival (edição rápida)")
    st.markdown("Selecione um festival, ajuste latitude/longitude e salve. Isto atualiza o CSV processado.")

    if df_clean is None:
        st.info("Nenhum CSV limpo. Gere via Importar CSV.")
    else:
        names = df_clean["festival_name"].fillna("Unnamed").tolist()
        sel = st.selectbox("Escolha festival", options=names)
        idx = df_clean[df_clean["festival_name"] == sel].index
        if len(idx) == 0:
            st.warning("Festival não encontrado (nome duplicado?).")
        else:
            i = idx[0]
            row = df_clean.loc[i].to_dict()
            lat_col, lon_col = get_lat_lon_columns(df_clean)
            lat_val = row.get(lat_col) if lat_col else None
            lon_val = row.get(lon_col) if lon_col else None

            with st.form("edit_form"):
                st.text_input("Nome", value=row.get("festival_name", ""), key="edit_name")
                st.text_input("País declarado", value=row.get("country_en", row.get("country", "")), key="edit_country")
                new_lat = st.text_input("Latitude", value=str(lat_val) if pd.notna(lat_val) else "", key="edit_lat")
                new_lon = st.text_input("Longitude", value=str(lon_val) if pd.notna(lon_val) else "", key="edit_lon")
                submitted = st.form_submit_button("Salvar alterações")
                if submitted:
                    # aplicar mudanças
                    if lat_col and lon_col:
                        try:
                            df_clean.at[i, lat_col] = float(new_lat)
                            df_clean.at[i, lon_col] = float(new_lon)
                        except Exception:
                            st.error("Latitude/Longitude inválidas.")
                    df_clean.at[i, "festival_name"] = st.session_state["edit_name"]
                    df_clean.at[i, "country_en"] = st.session_state["edit_country"]
                    # salvar
                    out = DATA_PROCESSED / "datatrance_clean.csv"
                    df_clean.to_csv(out, index=False)
                    st.success(f"Registro atualizado e salvo em {out}")

# ------- EXPORTAR GEOJSON -------
elif page == "Exportar GeoJSON":
    st.title("Exportar GeoJSON")
    st.markdown("Gera um arquivo GeoJSON a partir do CSV limpo para uso no frontend (Leaflet / Mapbox / QGIS).")

    if df_clean is None:
        st.info("Nenhum CSV limpo encontrado.")
    else:
        st.write(f"Registros disponíveis para export: {len(df_clean)}")
        if st.button("Gerar festivals.geojson"):
            out = export_geojson(df_clean, GEOJSON_OUT)
            st.success(f"GeoJSON gerado: {out}")
            with open(out, "r", encoding="utf-8") as f:
                data = f.read()
            st.download_button("Download festivals.geojson", data=data, file_name="festivals.geojson", mime="application/geo+json")

# ------- SOBRE -------
elif page == "Sobre":
    st.title("Sobre — Nomad Core")
    st.markdown("""
    Nomad Core — Data Manager para Nomad Maps.
    
    Funcionalidades incluídas nesta versão:
    - Upload de CSV e execução do ETL (etl/cleaner.py)
    - Visualização da base limpa
    - Validação geográfica (opcional, via Nominatim)
    - Mapa interativo (Folium)
    - Edição básica e exportação GeoJSON

    Próximos passos recomendados:
    - Integrar PostGIS e API FastAPI
    - Melhorar editor espacial (arrastar marcador)
    - Implementar autenticação no manager
    - Automatizar enriquecimento (altitude, aeroporto, bioma)
    """)
    st.markdown("Executando em: " + str(BASE_DIR))
    