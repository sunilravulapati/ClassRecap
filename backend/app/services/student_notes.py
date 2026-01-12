import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenRouter Client
api_key = os.getenv("OPENROUTER_API_KEY")

if not api_key:
    print("⚠️ WARNING: OPENROUTER_API_KEY not found in .env file")
    client = None
else:
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
        default_headers={
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Student Notes Refinement"
        }
    )

def generate_student_notes(raw_content: str) -> str:
    """
    Refines raw student notes into a detailed study guide.
    """
    
    if not raw_content or not raw_content.strip():
        return "⚠️ No content provided to refine."
    
    if client is None:
        return "❌ Configuration Error: OpenRouter API key is missing."
    
    # --- UPDATED PROMPT FOR DETAILED ANSWERS ---
    prompt = f"""
    You are an expert academic tutor creating a comprehensive study guide based on a student's rough class notes.

    YOUR GOAL:
    Transform the raw notes into detailed, self-contained learning material. 
    If the student mentions a topic briefly (e.g., "teacher discussed interfaces"), YOU MUST EXPAND ON IT with a full explanation and examples.

    RULES:
    1. **Expand & Explain**: Do not just fix grammar. If a concept is mentioned, define it and explain how it works.
    2. **Fill in the Blanks**: If the notes say "we covered differences between X and Y" but don't list them, use your knowledge to provide those differences.
    3. **Structure**: Use clear Markdown headers (#, ##), bullet points, and bold text for key terms.
    4. **Examples**: Add code snippets (for coding topics) or illustrative examples (for theory) where appropriate, even if they weren't in the raw text.
    5. **Tone**: Educational, encouraging, and clear.
    
    FORMATTING RULES:
    - When creating tables, ensure there is a NEWLINE after every row.
    - Do not compress tables into a single line.
    - Use standard Markdown table syntax.

    Raw Notes:
    {raw_content}

    Output the detailed study guide in Markdown:
    """

    try:
        response = client.chat.completions.create(
            model="google/gemini-2.0-flash-001",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5, # Increased temperature slightly for more creativity/expansion
            max_tokens=3000,
        )
        
        refined_notes = response.choices[0].message.content.strip()
        
        # --- Cleaning Logic (Same as before) ---
        if refined_notes.startswith("```markdown"):
            refined_notes = refined_notes.replace("```markdown", "").replace("```", "").strip()
        elif refined_notes.startswith("```"):
            refined_notes = refined_notes.replace("```", "").strip()
        
        prefixes_to_remove = ["here is the refined", "sure,", "here is a comprehensive"]
        refined_lower = refined_notes.lower()
        for prefix in prefixes_to_remove:
            if refined_lower.startswith(prefix):
                # Find the first newline after the prefix to cut cleanly
                first_newline = refined_notes.find('\n')
                if first_newline != -1:
                    refined_notes = refined_notes[first_newline:].strip()
                else:
                    refined_notes = refined_notes.replace(prefix, "", 1).strip()
                break
        
        if not refined_notes.startswith('#'):
            refined_notes = f"# Comprehensive Class Notes\n\n{refined_notes}"
        
        return refined_notes
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ AI Generation Error: {error_msg}")
        return "❌ Error: Unable to generate detailed notes. Please try again."