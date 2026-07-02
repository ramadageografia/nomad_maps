# ============================================================
# NOMAD MAPS – DataTrance Cleaner v1.0
# Fase 1: Limpeza e Validação da Base
# ============================================================

import pandas as pd
import re
import time
import uuid
import os
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

# ============================================================
# CONFIGURAÇÕES DE CAMINHOS
# ============================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INPUT_FILE    = os.path.join(BASE_DIR, 'data', 'datatrance_v1.csv')
OUTPUT_CLEAN  = os.path.join(BASE_DIR, 'output', 'datatrance_clean.csv')
OUTPUT_ERRORS = os.path.join(BASE_DIR, 'output', 'datatrance_errors.csv')
OUTPUT_MAP    = os.path.join(BASE_DIR, 'output', 'validation_map.html')

SLEEP_TIME = 1.2

# ============================================================
# DICIONÁRIOS
# ============================================================

COUNTRY_MAP = {
    'Brasil': 'Brazil',
    'Alemanha': 'Germany',
    'África do Sul': 'South Africa',
    'Colômbia': 'Colombia',
    'Bolívia': 'Bolivia',
    'Canadá': 'Canada',
    'Servia': 'Serbia',
    'Sérvia': 'Serbia',
    'México': 'Mexico',
    'Marrocos': 'Morocco',
    'Tunísia': 'Tunisia',
    'Hungria': 'Hungary',
    'Romênia': 'Romania',
    'Croácia': 'Croatia',
    'Suíça': 'Switzerland',
    'Tailândia': 'Thailand',
    'Índia': 'India',
    'Equador': 'Ecuador',
    'Namíbia': 'Namibia',
    'Uruguai': 'Uruguay',
    'Noruega': 'Norway',
    'Turquia': 'Turkey',
    'Japão': 'Japan',
    'Grécia': 'Greece',
    'Espanha': 'Spain',
    'França': 'France',
    'Inglaterra': 'United Kingdom',
    'Nova Zelândia': 'New Zealand',
    'EUA': 'United States',
    'Costa Rica': 'Costa Rica',
    'Guatemala': 'Guatemala',
    'Venezuela': 'Venezuela',
    'Peru': 'Peru',
    'Chile': 'Chile',
    'Argentina': 'Argentina',
    'Portugal': 'Portugal',
    'Panamá': 'Panama',
    'Nepal': 'Nepal',
    'China': 'China',
    'Cambodia': 'Cambodia',
    'Austrália': 'Australia',
}

ISO_MAP = {
    'Brazil': 'BR', 'Germany': 'DE', 'South Africa': 'ZA',
    'Colombia': 'CO', 'Bolivia': 'BO', 'Canada': 'CA',
    'Serbia': 'RS', 'Mexico': 'MX', 'Morocco': 'MA',
    'Tunisia': 'TN', 'Hungary': 'HU', 'Romania': 'RO',
    'Croatia': 'HR', 'Switzerland': 'CH', 'Thailand': 'TH',
    'India': 'IN', 'Ecuador': 'EC', 'Namibia': 'NA',
    'Uruguay': 'UY', 'Norway': 'NO', 'Turkey': 'TR',
    'Japan': 'JP', 'Greece': 'GR', 'Spain': 'ES',
    'France': 'FR', 'United Kingdom': 'GB', 'New Zealand': 'NZ',
    'United States': 'US', 'Costa Rica': 'CR', 'Guatemala': 'GT',
    'Venezuela': 'VE', 'Peru': 'PE', 'Chile': 'CL',
    'Argentina': 'AR', 'Portugal': 'PT', 'Panama': 'PA',
    'Nepal': 'NP', 'China': 'CN', 'Cambodia': 'KH',
    'Australia': 'AU',
}

CONTINENT_MAP = {
    'BR': 'South America', 'AR': 'South America', 'CL': 'South America',
    'CO': 'South America', 'BO': 'South America', 'PE': 'South America',
    'UY': 'South America', 'VE': 'South America', 'EC': 'South America',
    'PT': 'Europe', 'ES': 'Europe', 'FR': 'Europe',
    'DE': 'Europe', 'GB': 'Europe', 'RS': 'Europe',
    'HR': 'Europe', 'HU': 'Europe', 'RO': 'Europe',
    'CH': 'Europe', 'GR': 'Europe', 'NO': 'Europe',
    'ZA': 'Africa', 'MA': 'Africa', 'TN': 'Africa', 'NA': 'Africa',
    'US': 'North America', 'CA': 'North America', 'MX': 'North America',
    'GT': 'Central America', 'CR': 'Central America', 'PA': 'Central America',
    'IN': 'Asia', 'NP': 'Asia', 'TH': 'Asia',
    'JP': 'Asia', 'CN': 'Asia', 'KH': 'Asia', 'TR': 'Asia',
    'AU': 'Oceania', 'NZ': 'Oceania',
}

# ============================================================
# FUNÇÕES
# ============================================================

def parse_wkt(wkt):
    if pd.isna(wkt) or str(wkt).strip() == '':
        return None, None
    try:
        match = re.search(
            r'POINT\s*\(([+-]?\d+\.?\d*)\s+([+-]?\d+\.?\d*)\)',
            str(wkt)
        )
        if match:
            lon = float(match.group(1))
            lat = float(match.group(2))
            return lat, lon
    except Exception as e:
        print(f"  Erro ao parsear WKT: {wkt} - {e}")
    return None, None


def validate_coords(lat, lon):
    if lat is None or lon is None:
        return False
    if not (-90 <= lat <= 90):
        return False
    if not (-180 <= lon <= 180):
        return False
    return True


def standardize_country(country_raw):
    if pd.isna(country_raw):
        return None
    return COUNTRY_MAP.get(
        str(country_raw).strip(),
        str(country_raw).strip()
    )


def get_iso(country_en):
    if not country_en:
        return 'XX'
    return ISO_MAP.get(country_en, 'XX')


def get_continent(iso_code):
    return CONTINENT_MAP.get(iso_code, 'Unknown')


def generate_id(country_iso):
    short = str(uuid.uuid4())[:8].upper()
    prefix = country_iso if country_iso != 'XX' else 'XX'
    return f"NM-{prefix}-{short}"


# ============================================================
# PIPELINE PRINCIPAL
# ============================================================

def run_pipeline():

    print()
    print("=" * 55)
    print("  NOMAD MAPS - DataTrance Cleaner v1.0")
    print("=" * 55)

    print("\n[1/6] Carregando dados...")

    try:
        df = pd.read_csv(INPUT_FILE, sep=',')
    except Exception:
        df = pd.read_csv(INPUT_FILE, sep='\t')

    print(f"      Registros carregados: {len(df)}")
    print(f"      Colunas encontradas: {list(df.columns)}")

    print("\n[2/6] Removendo linhas vazias...")
    df = df.dropna(subset=['festival_name'])
    df = df[df['festival_name'].astype(str).str.strip() != '']
    df = df.reset_index(drop=True)
    print(f"      Registros validos: {len(df)}")

    print("\n[3/6] Extraindo coordenadas do WKT...")
    coords = df['wkt'].apply(parse_wkt)
    df['lat'] = coords.apply(lambda x: x[0])
    df['lon'] = coords.apply(lambda x: x[1])
    df['coords_valid'] = df.apply(
        lambda r: validate_coords(r['lat'], r['lon']), axis=1
    )
    valid_count = df['coords_valid'].sum()
    print(f"      Coordenadas validas: {valid_count}")
    print(f"      Coordenadas invalidas: {len(df) - valid_count}")

    print("\n[4/6] Padronizando paises...")
    df['country_en'] = df['country'].apply(standardize_country)
    df['iso_code'] = df['country_en'].apply(get_iso)
    df['continent'] = df['iso_code'].apply(get_continent)
    print(f"      Paises unicos: {df['country_en'].nunique()}")
    print(f"      Continentes: {df['continent'].nunique()}")

    print("\n[5/6] Gerando IDs unicos...")
    df['festival_id'] = df['iso_code'].apply(generate_id)
    print(f"      IDs gerados: {len(df)}")

    print("\n[6/6] Removendo duplicatas...")
    before = len(df)
    df['dedup_key'] = (
        df['festival_name'].astype(str).str.lower().str.strip() + '_' +
        df['country_en'].fillna('').astype(str).str.lower().str.strip()
    )
    df = df.drop_duplicates(subset=['dedup_key'], keep='first')
    after = len(df)
    print(f"      Antes: {before} | Depois: {after} | Removidas: {before - after}")

    # Exportar
    print("\nExportando resultados...")
    os.makedirs(os.path.dirname(OUTPUT_CLEAN), exist_ok=True)
    df.to_csv(OUTPUT_CLEAN, index=False)
    print(f"      Base limpa: {OUTPUT_CLEAN}")

    print()
    print("=" * 55)
    print("  RELATORIO FINAL")
    print("=" * 55)
    print(f"  Total de festivais:   {len(df)}")
    print(f"  Paises unicos:        {df['country_en'].nunique()}")
    print(f"  Continentes:          {df['continent'].nunique()}")
    print(f"  Coords validas:       {df['coords_valid'].sum()}")
    print(f"  Coords invalidas:     {(~df['coords_valid']).sum()}")
    print("=" * 55)
    print()

    return df


# ============================================================
# MAPA DE VALIDAÇÃO
# ============================================================

def generate_map(df):
    try:
        import folium
    except ImportError:
        print("folium nao instalado.")
        return

    print("\nGerando mapa de validacao...")

    m = folium.Map(location=[20, 0], zoom_start=2)

    for _, row in df.iterrows():
        if not row['coords_valid']:
            continue

        popup = f"""
        <b>{row['festival_name']}</b><br>
        Pais: {row.get('country_en', '')}<br>
        Continente: {row.get('continent', '')}<br>
        Lat: {row['lat']:.4f} | Lon: {row['lon']:.4f}
        """

        folium.CircleMarker(
            location=[row['lat'], row['lon']],
            radius=7,
            color='purple',
            fill=True,
            fill_color='magenta',
            fill_opacity=0.7,
            popup=folium.Popup(popup, max_width=280)
        ).add_to(m)

    m.save(OUTPUT_MAP)
    print(f"      Mapa salvo: {OUTPUT_MAP}")
    print(f"      Abra no navegador para visualizar")


# ============================================================
# EXECUTAR
# ============================================================

if __name__ == "__main__":
    df_clean = run_pipeline()
    generate_map(df_clean)
    print("\nPipeline completo!")
    print("Verifique a pasta: output/")