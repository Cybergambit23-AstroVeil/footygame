import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path

st.set_page_config(
    page_title="Football Stars",
    page_icon="⚽",
    layout="wide"
)

st.markdown("""
<style>
body{
    margin:0;
    overflow:hidden;
}
iframe{
    border:none;
}
</style>
""", unsafe_allow_html=True)

html = Path("static/index.html").read_text(encoding="utf-8")

components.html(
    html,
    height=900,
    scrolling=False,
)
