"""
Streamlit ML Demos Application
"""
import streamlit as st

# Page config
st.set_page_config(
    page_title="ML Demos",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Sidebar navigation
st.sidebar.title("🤖 ML Demos")
st.sidebar.markdown("---")

demo_choice = st.sidebar.radio(
    "Choose a demo:",
    ["Overview", "Demo 1: Text Analysis", "Demo 2: Data Visualization", "How It Works", "Limitations"]
)

# Main content
if demo_choice == "Overview":
    st.title("Machine Learning Demonstrations")
    st.markdown("""
    Welcome to my ML demos! This section showcases various machine learning capabilities
    with interactive examples.
    
    ## Available Demos
    
    1. **Text Analysis** - Sentiment analysis and text classification
    2. **Data Visualization** - Interactive data exploration
    
    ## How to Use
    
    1. Select a demo from the sidebar
    2. Adjust parameters and inputs
    3. View real-time results
    
    ## Technologies Used
    
    - **Streamlit** - Interactive web framework
    - **Python** - Core programming language
    - **scikit-learn** - Machine learning library
    - **Plotly** - Interactive visualizations
    """)
    
elif demo_choice == "Demo 1: Text Analysis":
    from demos.demo1 import run_demo
    run_demo()
    
elif demo_choice == "Demo 2: Data Visualization":
    from demos.demo2 import run_demo
    run_demo()
    
elif demo_choice == "How It Works":
    st.title("How It Works")
    st.markdown("""
    ## Architecture
    
    These demos run on a Streamlit server that:
    1. Accepts user input through interactive widgets
    2. Processes data using ML models
    3. Displays results in real-time
    
    ## Model Details
    
    - **Demo 1**: Uses pre-trained sentiment analysis models
    - **Demo 2**: Implements statistical analysis and visualization
    
    ## Performance Considerations
    
    - Models are cached for faster subsequent runs
    - Large datasets are sampled for responsiveness
    - Results are computed on-demand
    """)
    
elif demo_choice == "Limitations":
    st.title("Limitations & Considerations")
    st.markdown("""
    ## Current Limitations
    
    1. **Model Size**: Using smaller models for faster inference
    2. **Data Privacy**: No data is stored; all processing is ephemeral
    3. **Rate Limits**: Heavy usage may experience throttling
    4. **Accuracy**: Demo models prioritize speed over accuracy
    
    ## Future Improvements
    
    - [ ] Add more sophisticated models
    - [ ] Implement user authentication
    - [ ] Add data export functionality
    - [ ] Expand demo variety
    
    ## Feedback
    
    Have suggestions? [Contact me](/contact) with your ideas!
    """)

# Footer
st.sidebar.markdown("---")
st.sidebar.markdown("Built with ❤️ using Streamlit")
