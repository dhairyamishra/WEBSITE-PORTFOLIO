#!/usr/bin/env python3
"""
Local Environment Setup Script
Cross-platform (Windows, Linux, macOS)
"""

import os
import sys
import shutil
import subprocess
from pathlib import Path


def print_color(message, color="white"):
    """Print colored output (works on all platforms)"""
    colors = {
        "green": "\033[92m",
        "yellow": "\033[93m",
        "red": "\033[91m",
        "cyan": "\033[96m",
        "reset": "\033[0m"
    }
    
    # Windows color support
    if sys.platform == "win32":
        os.system("")  # Enable ANSI escape sequences on Windows
    
    color_code = colors.get(color, colors["reset"])
    print(f"{color_code}{message}{colors['reset']}")


def check_command(command, name, install_url=None):
    """Check if a command exists"""
    if shutil.which(command):
        try:
            result = subprocess.run(
                [command, "--version"],
                capture_output=True,
                text=True,
                check=False
            )
            version = result.stdout.strip().split("\n")[0]
            print_color(f"✅ {name} found: {version}", "green")
            return True
        except Exception:
            print_color(f"✅ {name} found", "green")
            return True
    else:
        print_color(f"❌ {name} is required but not installed.", "red")
        if install_url:
            print_color(f"   Download from: {install_url}", "yellow")
        return False


def create_directories():
    """Create data directory structure"""
    print_color("📁 Creating data directories...", "cyan")
    
    base_dirs = ["models", "datasets", "outputs", "uploads"]
    subdirs = {
        "models": ["nlp", "cv", "audio"],
        "datasets": ["images", "text", "audio"],
        "outputs": ["generated_text", "generated_images"],
        "uploads": ["user_files"]
    }
    
    for base in base_dirs:
        for sub in subdirs.get(base, []):
            path = Path("data") / base / sub
            path.mkdir(parents=True, exist_ok=True)
    
    print_color("✅ Data directories created", "green")


def create_env_file():
    """Create .env.local from template"""
    env_local = Path(".env.local")
    env_example = Path(".env.example")
    
    if not env_local.exists():
        if env_example.exists():
            print_color("📝 Creating .env.local from template...", "cyan")
            shutil.copy(env_example, env_local)
            print_color("⚠️  Please edit .env.local with your configuration", "yellow")
        else:
            print_color("⚠️  .env.example not found, skipping .env.local creation", "yellow")
    else:
        print_color("✅ .env.local already exists", "green")


def install_dependencies():
    """Install dependencies for each app"""
    
    # Homepage
    homepage_path = Path("apps/homepage")
    if homepage_path.exists():
        print_color("📦 Installing homepage dependencies...", "cyan")
        try:
            subprocess.run(
                ["npm", "install"],
                cwd=homepage_path,
                check=True,
                capture_output=True
            )
            print_color("✅ Homepage dependencies installed", "green")
        except subprocess.CalledProcessError as e:
            print_color(f"❌ Failed to install homepage dependencies: {e}", "red")
    
    # API
    api_path = Path("apps/api")
    if api_path.exists():
        print_color("📦 Installing API dependencies...", "cyan")
        try:
            subprocess.run(
                ["npm", "install"],
                cwd=api_path,
                check=True,
                capture_output=True
            )
            print_color("✅ API dependencies installed", "green")
        except subprocess.CalledProcessError as e:
            print_color(f"❌ Failed to install API dependencies: {e}", "red")
    
    # Demos
    demos_path = Path("apps/demos")
    if demos_path.exists():
        print_color("📦 Installing demos dependencies...", "cyan")
        
        venv_path = demos_path / "venv"
        
        # Create virtual environment if it doesn't exist
        if not venv_path.exists():
            try:
                subprocess.run(
                    [sys.executable, "-m", "venv", "venv"],
                    cwd=demos_path,
                    check=True
                )
                print_color("✅ Virtual environment created", "green")
            except subprocess.CalledProcessError as e:
                print_color(f"❌ Failed to create virtual environment: {e}", "red")
                return
        
        # Determine pip path based on OS
        if sys.platform == "win32":
            pip_path = venv_path / "Scripts" / "pip"
        else:
            pip_path = venv_path / "bin" / "pip"
        
        # Install requirements
        requirements_path = demos_path / "requirements.txt"
        if requirements_path.exists():
            try:
                subprocess.run(
                    [str(pip_path), "install", "-r", "requirements.txt"],
                    cwd=demos_path,
                    check=True,
                    capture_output=True
                )
                print_color("✅ Demos dependencies installed", "green")
            except subprocess.CalledProcessError as e:
                print_color(f"❌ Failed to install demos dependencies: {e}", "red")


def main():
    """Main setup function"""
    print_color("🚀 Setting up local development environment...", "green")
    print()
    
    # Check prerequisites
    print_color("📋 Checking prerequisites...", "cyan")
    
    all_present = True
    all_present &= check_command("node", "Node.js", "https://nodejs.org/")
    all_present &= check_command("python", "Python", "https://www.python.org/")
    all_present &= check_command("docker", "Docker", "https://www.docker.com/products/docker-desktop")
    
    # PM2 is optional
    if not check_command("pm2", "PM2"):
        print_color("   Install with: npm install -g pm2", "yellow")
    
    if not all_present:
        print_color("\n❌ Please install missing prerequisites and try again.", "red")
        sys.exit(1)
    
    print_color("✅ Prerequisites check passed", "green")
    print()
    
    # Create directories
    create_directories()
    print()
    
    # Create environment file
    create_env_file()
    print()
    
    # Install dependencies
    install_dependencies()
    print()
    
    # Success message
    print_color("✅ Setup complete!", "green")
    print()
    print_color("Next steps:", "cyan")
    print("  1. Edit .env.local with your configuration")
    print("  2. Start services with: pm2 start ecosystem.config.cjs")
    print("  3. View logs with: pm2 logs")
    print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print_color("\n\n⚠️  Setup interrupted by user", "yellow")
        sys.exit(1)
    except Exception as e:
        print_color(f"\n❌ An error occurred: {e}", "red")
        sys.exit(1)
