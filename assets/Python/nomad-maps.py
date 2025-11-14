 # nomad-maps.py
import pandas as pd
import requests
import json
from io import BytesIO
import os

def main():
    print("🚀 Iniciando conversão de Excel para JSON...")
    
    # URL do arquivo Excel
    url = "https://github.com/ramadageografia/nomad_maps/raw/main/assets/Dados/Raw/Global%20Map%20of%20Trance%20Festivals%20%20-%20NOMAD%20MAPS-%20Lista%20completa3.xlsx"
    
    try:
        # Fazer download do arquivo
        print("📥 Baixando arquivo Excel...")
        response = requests.get(url)
        response.raise_for_status()  # Verifica se o download foi bem-sucedido
        
        # Ler o Excel
        print("📊 Convertendo Excel para DataFrame...")
        excel_file = BytesIO(response.content)
        
        # Verificar abas disponíveis
        xl = pd.ExcelFile(excel_file)
        print(f"📑 Abas encontradas: {xl.sheet_names}")
        
        # Ler a primeira aba
        df = pd.read_excel(excel_file, sheet_name=0)
        
        print(f"✅ Dados carregados: {df.shape[0]} linhas x {df.shape[1]} colunas")
        print(f"🏷️ Colunas: {list(df.columns)}")
        
        # Mostrar preview
        print("\n🔍 Preview dos dados:")
        print(df.head(3))
        
        # Converter para JSON
        print("\n🔄 Convertendo para JSON...")
        json_data = df.to_json(orient='records', indent=2, force_ascii=False)
        
        # Salvar arquivo JSON
        output_file = 'festivais_trance_global.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(json_data)
        
        print(f"✅ Conversão concluída com sucesso!")
        print(f"📁 Arquivo salvo como: {output_file}")
        print(f"📊 Total de registros: {len(df)}")
        print(f"💾 Tamanho do arquivo JSON: {len(json_data)} caracteres")
        
        # Verificar se o arquivo foi criado
        if os.path.exists(output_file):
            print(f"📂 Arquivo JSON criado em: {os.path.abspath(output_file)}")
        
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro no download: {e}")
        return False
    except Exception as e:
        print(f"❌ Erro na conversão: {e}")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print("\n🎉 Processo finalizado com sucesso!")
    else:
        print("\n💀 Ocorreu um erro durante o processo.")
   
