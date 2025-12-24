"""
Demo 2: Data Visualization
Interactive data exploration demo
"""
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px

def run_demo():
    st.title("📊 Data Visualization Demo")
    
    st.markdown("""
    This demo generates and visualizes random datasets with interactive controls.
    """)
    
    # Parameters
    col1, col2 = st.columns(2)
    with col1:
        num_points = st.slider("Number of data points", 10, 1000, 100)
    with col2:
        chart_type = st.selectbox("Chart type", ["Scatter", "Line", "Bar", "Histogram"])
    
    # Generate data
    np.random.seed(42)
    df = pd.DataFrame({
        'x': np.random.randn(num_points),
        'y': np.random.randn(num_points),
        'category': np.random.choice(['A', 'B', 'C'], num_points)
    })
    
    # Create visualization
    if chart_type == "Scatter":
        fig = px.scatter(df, x='x', y='y', color='category', title="Scatter Plot")
    elif chart_type == "Line":
        fig = px.line(df.sort_values('x'), x='x', y='y', color='category', title="Line Chart")
    elif chart_type == "Bar":
        fig = px.bar(df.groupby('category').size().reset_index(name='count'), 
                     x='category', y='count', title="Bar Chart")
    else:  # Histogram
        fig = px.histogram(df, x='x', color='category', title="Histogram")
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Statistics
    st.subheader("Dataset Statistics")
    st.dataframe(df.describe())
