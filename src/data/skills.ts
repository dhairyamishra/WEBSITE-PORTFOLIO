export interface SkillGroup {
  category: string;
  items: string[];
  color: 'rose' | 'gold' | 'violet';
}

export const skills: SkillGroup[] = [
  { category: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C++', 'SQL', 'HTML/CSS'], color: 'rose' },
  { category: 'ML / AI', items: ['PyTorch', 'TensorFlow', 'Hugging Face', 'scikit-learn', 'OpenCV', 'RAG', 'ChromaDB', 'FAISS', 'wandb'], color: 'gold' },
  { category: 'Cloud & DevOps', items: ['EC2', 'S3', 'Lambda', 'GKE', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Jenkins', 'ArgoCD', 'PM2'], color: 'violet' },
  { category: 'Frameworks & App Dev', items: ['FastAPI', 'React', 'Astro', 'Vite', 'TailwindCSS', 'Streamlit', 'Uvicorn', 'Zustand', 'React Flow'], color: 'rose' },
  { category: 'Data & Storage', items: ['PostgreSQL', 'MongoDB', 'MySQL', 'Pandas', 'NumPy', 'Spark', 'HDFS', 'REST APIs'], color: 'gold' },
  { category: 'Testing & Observability', items: ['OpenTelemetry', 'Grafana', 'Prometheus', 'Elastic Stack', 'Playwright', 'pytest', 'Pydantic'], color: 'violet' },
];
