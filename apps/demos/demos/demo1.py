"""
Demo 1: Text Analysis
Simple sentiment analysis demo
"""
import streamlit as st
from textblob import TextBlob
import plotly.graph_objects as go

def run_demo():
    st.title("📝 Text Analysis Demo")
    
    st.markdown("""
    This demo analyzes the sentiment of your text using natural language processing.
    """)
    
    # User input
    user_text = st.text_area(
        "Enter text to analyze:",
        placeholder="Type or paste your text here...",
        height=150
    )
    
    if user_text:
        # Analyze sentiment
        blob = TextBlob(user_text)
        sentiment = blob.sentiment
        
        # Display results
        col1, col2 = st.columns(2)
        
        with col1:
            st.metric("Polarity", f"{sentiment.polarity:.2f}")
            st.caption("Range: -1 (negative) to +1 (positive)")
            
        with col2:
            st.metric("Subjectivity", f"{sentiment.subjectivity:.2f}")
            st.caption("Range: 0 (objective) to 1 (subjective)")
        
        # Visualization
        fig = go.Figure()
        fig.add_trace(go.Bar(
            x=['Polarity', 'Subjectivity'],
            y=[sentiment.polarity, sentiment.subjectivity],
            marker_color=['#3b82f6', '#8b5cf6']
        ))
        fig.update_layout(
            title="Sentiment Analysis Results",
            yaxis_range=[-1, 1],
            height=400
        )
        st.plotly_chart(fig, use_container_width=True)
        
        # Interpretation
        if sentiment.polarity > 0.1:
            st.success("✅ Positive sentiment detected")
        elif sentiment.polarity < -0.1:
            st.error("❌ Negative sentiment detected")
        else:
            st.info("ℹ️ Neutral sentiment detected")
