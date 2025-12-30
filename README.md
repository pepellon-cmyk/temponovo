# Kite for Life — App de Avaliação de Desempenho (prototipo)

Este é um protótipo simples em Streamlit que permite:
- Fazer upload e editar um CSV;
- Inserir avaliações via formulário;
- Salvar avaliações em um banco SQLite local;
- Exportar avaliações para CSV;
- Ver estatísticas básicas.

Requisitos
- Python 3.8+
- Pip

Instalação e execução
1. Clone / copie os arquivos para uma pasta.
2. Crie um ambiente virtual (recomendado):
   - python -m venv .venv
   - source .venv/bin/activate (Linux/macOS) ou .venv\Scripts\activate (Windows)
3. Instale dependências:
   - pip install -r requirements.txt
4. Rode o app:
   - streamlit run app.py

Próximos passos que eu posso implementar para você:
- Campos e esquema adaptados exatamente ao seu CSV (mapear colunas reais);
- Autenticação e permissões (por exemplo, login com Google);
- Interface mais rica (React + FastAPI) e deploy em Vercel/Heroku/AWS;
- Relatórios em PDF e envio por e-mail;
- Importação automática de várias planilhas e histórico por usuário.

Diga qual caminho prefere: gerar o repositório com esses arquivos agora, ou eu preparo outra tecnologia (web app completo, mobile, ou no-code).