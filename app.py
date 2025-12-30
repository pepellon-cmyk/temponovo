# app.py
import streamlit as st
import pandas as pd
import sqlite3
from io import StringIO
import datetime
import os

st.set_page_config(page_title="Kite for Life - Avaliação de Desempenho", layout="wide")
st.title("Kite for Life — Avaliação de Desempenho")

DB_PATH = "evaluations.db"

# Inicializa DB
conn = sqlite3.connect(DB_PATH, check_same_thread=False)
c = conn.cursor()
c.execute(
    """
    CREATE TABLE IF NOT EXISTS evaluations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        projeto TEXT,
        nome TEXT,
        cargo TEXT,
        data TEXT,
        nota REAL,
        comentarios TEXT
    )
    """
)
conn.commit()

# Sidebar: Upload CSV
st.sidebar.header("Importar / Exportar")
uploaded_file = st.sidebar.file_uploader("Faça upload de um arquivo CSV", type=["csv"])

if uploaded_file:
    try:
        df = pd.read_csv(uploaded_file)
    except Exception as e:
        st.sidebar.error(f"Erro ao ler CSV: {e}")
        df = None

    if df is not None:
        st.sidebar.markdown("Visualizar e editar CSV")
        edited = st.experimental_data_editor(df, num_rows="dynamic")
        if st.sidebar.button("Salvar CSV editado (local)"):
            edited.to_csv("uploaded_saved.csv", index=False)
            st.sidebar.success("CSV salvo como uploaded_saved.csv")
        if st.sidebar.button("Importar linhas do CSV para o banco de avaliações"):
            # Tentativa de mapear colunas comuns
            count = 0
            for _, row in edited.iterrows():
                projeto = row.get("projeto") or row.get("PROJETO") or "KITE FOR LIFE"
                nome = row.get("nome") or row.get("Nome") or row.get("NOME") or ""
                cargo = row.get("cargo") or row.get("Cargo") or ""
                data = row.get("data") or row.get("Data") or ""
                nota = row.get("nota") or row.get("Nota") or None
                comentarios = row.get("comentarios") or row.get("Comentários") or ""
                try:
                    c.execute(
                        "INSERT INTO evaluations (projeto, nome, cargo, data, nota, comentarios) VALUES (?, ?, ?, ?, ?, ?)",
                        (projeto, nome, cargo, data, nota, comentarios),
                    )
                    count += 1
                except Exception as e:
                    st.warning(f"Não foi possível importar linha: {e}")
            conn.commit()
            st.sidebar.success(f"{count} linhas importadas para o banco de avaliações.")

# Formulário para adicionar nova avaliação
st.header("Adicionar nova avaliação")
with st.form("add_eval"):
    col1, col2, col3 = st.columns(3)
    projeto = col1.text_input("Projeto", value="KITE FOR LIFE")
    nome = col2.text_input("Nome do avaliado")
    cargo = col3.text_input("Cargo")
    col4, col5 = st.columns(2)
    data_av = col4.date_input("Data", value=datetime.date.today())
    nota = col5.slider("Nota (0-100)", min_value=0.0, max_value=100.0, value=75.0, step=0.5)
    comentarios = st.text_area("Comentários", height=100)
    submitted = st.form_submit_button("Salvar avaliação")

if submitted:
    c.execute(
        "INSERT INTO evaluations (projeto, nome, cargo, data, nota, comentarios) VALUES (?, ?, ?, ?, ?, ?)",
        (projeto, nome, cargo, data_av.isoformat(), float(nota), comentarios),
    )
    conn.commit()
    st.success("Avaliação salva com sucesso.")

# Mostrar avaliações existentes
st.header("Avaliações registradas")
df_db = pd.read_sql_query("SELECT * FROM evaluations ORDER BY id DESC", conn)
st.dataframe(df_db)

# Estatísticas básicas
st.header("Resumo")
if not df_db.empty:
    col_a, col_b = st.columns(2)
    with col_a:
        st.metric("Número de avaliações", len(df_db))
        st.metric("Média das notas", round(df_db["nota"].astype(float).mean(), 2))
    with col_b:
        st.write("Média por cargo")
        mean_by_cargo = df_db.groupby("cargo")["nota"].mean().reset_index().sort_values("nota", ascending=False)
        st.table(mean_by_cargo)
else:
    st.info("Nenhuma avaliação registrada ainda.")

# Exportar banco para CSV
st.header("Exportar dados")
csv_export = df_db.to_csv(index=False)
st.download_button("Baixar todas as avaliações (CSV)", data=csv_export, file_name="avaliacoes_kite_for_life.csv", mime="text/csv")

# Botão para resetar DB (cuidado)
if st.button("Resetar banco (apagar todas avaliações)"):
    c.execute("DROP TABLE IF EXISTS evaluations")
    conn.commit()
    c.execute(
        """
        CREATE TABLE IF NOT EXISTS evaluations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            projeto TEXT,
            nome TEXT,
            cargo TEXT,
            data TEXT,
            nota REAL,
            comentarios TEXT
        )
        """
    )
    conn.commit()
    st.warning("Banco reiniciado. Todas as avaliações apagadas.")