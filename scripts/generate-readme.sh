#!/bin/bash

# Local README Generator Script
# This script allows you to test the README generation locally before pushing to GitHub

set -e

echo "🤖 Local README Generator for n8n-unifi-access"
echo "=============================================="

# Check if OpenAI API key is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ Error: OPENAI_API_KEY environment variable is not set"
    echo "Please set your OpenAI API key: export OPENAI_API_KEY='your-key-here'"
    exit 1
fi

# Check for required tools
for tool in curl jq tree; do
    if ! command -v $tool &> /dev/null; then
        echo "❌ Error: $tool is not installed"
        echo "Please install $tool to continue"
        exit 1
    fi
done

echo "📊 Analyzing codebase structure..."

# Create a comprehensive codebase summary
cat > codebase_summary.md << 'EOF'
# Codebase Analysis for README Generation

## Repository Information
- Repository: n8n-unifi-access
- Local analysis run
EOF

# Add directory tree
echo -e "\n## Directory Structure" >> codebase_summary.md
echo '```' >> codebase_summary.md
tree -I 'node_modules|.git|.next|dist|build|coverage|*.log' -a -L 3 2>/dev/null || find . -type f -not -path '*/.*' -not -path '*/node_modules/*' | head -50 >> codebase_summary.md
echo '```' >> codebase_summary.md

# Add package.json analysis if it exists
if [ -f "package.json" ]; then
    echo -e "\n## Package.json Analysis" >> codebase_summary.md
    echo '```json' >> codebase_summary.md
    cat package.json >> codebase_summary.md
    echo '```' >> codebase_summary.md
fi

# Add Docker configuration if it exists
if [ -f "Dockerfile" ] || [ -f "docker-compose.yml" ]; then
    echo -e "\n## Docker Configuration Found" >> codebase_summary.md
    [ -f "Dockerfile" ] && echo "- Dockerfile present" >> codebase_summary.md
    [ -f "docker-compose.yml" ] && echo "- docker-compose.yml present" >> codebase_summary.md
fi

# Add environment configuration
if [ -f ".env.example" ]; then
    echo -e "\n## Environment Configuration" >> codebase_summary.md
    echo '```' >> codebase_summary.md
    cat .env.example >> codebase_summary.md
    echo '```' >> codebase_summary.md
fi

# Add key source files content
echo -e "\n## Key Source Files (Preview)" >> codebase_summary.md
for file in $(find . -name "*.js" -o -name "*.ts" -o -name "*.py" -o -name "*.go" -o -name "*.rs" | grep -v node_modules | head -10); do
    if [ -f "$file" ]; then
        echo -e "\n### $file" >> codebase_summary.md
        echo '```' >> codebase_summary.md
        head -50 "$file" >> codebase_summary.md
        echo '```' >> codebase_summary.md
    fi
done

# Add current README for context
if [ -f "README.md" ]; then
    echo -e "\n## Current README.md" >> codebase_summary.md
    echo '```markdown' >> codebase_summary.md
    cat README.md >> codebase_summary.md
    echo '```' >> codebase_summary.md
fi

echo "🤖 Generating README with OpenAI..."

# Prepare the prompt
PROMPT="You are a technical documentation expert. Based on the following codebase analysis, generate a comprehensive, professional README.md file that includes:

1. Project title and brief description
2. Features and capabilities
3. Installation/setup instructions
4. Usage examples
5. API documentation (if applicable)
6. Configuration options
7. Development setup
8. Contributing guidelines
9. License information

Make the README engaging, well-structured with proper markdown formatting, and include code examples where appropriate. Focus on practical information that helps users understand and use the project.

IMPORTANT: Respond with ONLY the markdown content for the README.md file, no additional text or explanations.

Codebase Analysis:
$(cat codebase_summary.md)"

# Make API call to OpenAI
RESPONSE=$(curl -s -X POST "https://api.openai.com/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d "{
        \"model\": \"gpt-4\",
        \"messages\": [
            {
                \"role\": \"system\",
                \"content\": \"You are a technical documentation expert who creates clear, comprehensive README files.\"
            },
            {
                \"role\": \"user\",
                \"content\": $(echo "$PROMPT" | jq -R -s .)
            }
        ],
        \"max_tokens\": 4000,
        \"temperature\": 0.3
    }")

# Extract the generated content
NEW_README=$(echo "$RESPONSE" | jq -r '.choices[0].message.content')

if [ "$NEW_README" != "null" ] && [ ! -z "$NEW_README" ]; then
    echo "$NEW_README" > README_new.md
    echo "✅ README generated successfully!"
    
    # Check for changes
    if [ ! -f "README.md" ]; then
        echo "📝 No existing README.md found - new file will be created"
        CHANGES_DETECTED=true
    elif ! diff -q README.md README_new.md > /dev/null; then
        echo "📝 Changes detected in README.md"
        echo ""
        echo "🔍 Preview of changes:"
        echo "====================="
        diff README.md README_new.md || true
        echo "====================="
        CHANGES_DETECTED=true
    else
        echo "✅ No changes detected in README.md"
        CHANGES_DETECTED=false
    fi
    
    if [ "$CHANGES_DETECTED" = true ]; then
        echo ""
        read -p "🤔 Do you want to update README.md? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            mv README_new.md README.md
            echo "✅ README.md has been updated!"
        else
            echo "📄 Generated README saved as README_new.md for review"
        fi
    else
        rm README_new.md
    fi
else
    echo "❌ Failed to generate README. API Response:"
    echo "$RESPONSE"
    exit 1
fi

# Cleanup
rm -f codebase_summary.md

echo ""
echo "🎉 Done!"