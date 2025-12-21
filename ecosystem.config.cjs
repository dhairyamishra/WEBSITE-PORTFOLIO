module.exports = {
  apps: [
    {
      name: "web",
      cwd: "./apps/web",
      script: "npm",
      args: "run dev -- --host 0.0.0.0",  // Astro uses port 4321 by default
      env: {
        NODE_ENV: "development"
      },
      watch: false,
      autorestart: true
    },
    {
      name: "api",
      cwd: "./apps/api",
      script: "uvicorn",
      args: "app.main:app --reload --host 0.0.0.0 --port 8000",
      env: {
        ENVIRONMENT: "development"
      },
      watch: false,
      autorestart: true
    },
    {
      name: "demos",
      cwd: "./apps/demos",
      script: "python",
      args: "-m streamlit run app.py --server.address 0.0.0.0 --server.port 7860",
      env: {
        PORT: "7860"
      },
      watch: false,
      autorestart: true
    }
    // Add project containers as you build them:
    // {
    //   name: "project-chatbot",
    //   cwd: "./apps/projects/chatbot",
    //   script: "npm",
    //   args: "start",
    //   env: { PORT: "8001" }
    // }
  ]
};
