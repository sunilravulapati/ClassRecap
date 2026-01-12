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
    Refines raw student notes into structured, clean Markdown format.
    
    Args:
        raw_content: Raw notes from student
        
    Returns:
        Refined notes in Markdown format
    """
    
    # Validate input
    if not raw_content or not raw_content.strip():
        return "⚠️ No content provided to refine."
    
    # Check if client is initialized
    if client is None:
        return "❌ **Configuration Error**: OpenRouter API key is missing. Please add OPENROUTER_API_KEY to your .env file."
    
    # Simplified, more direct prompt
    prompt = f"""Refine these student notes into clean, well-organized Markdown format.

Rules:
- Start with # heading (topic name)
- Use ## for sections, ### for subsections
- Use bullet points for lists
- Bold important terms
- Be concise and clear
- NO conversational text (don't say "here is", "sure", etc.)

Raw notes:
{raw_content}

Output clean Markdown ONLY:"""

    try:
        response = client.chat.completions.create(
            # CHANGE THIS LINE to a stable model:
            model="google/gemini-2.0-flash-001", 
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3, # Slightly lower temperature for more consistent notes
            max_tokens=2000,
        )
        
        refined_notes = response.choices[0].message.content.strip()
        
        # Remove markdown code blocks if present
        if refined_notes.startswith("```markdown"):
            refined_notes = refined_notes.replace("```markdown", "").replace("```", "").strip()
        elif refined_notes.startswith("```"):
            refined_notes = refined_notes.replace("```", "").strip()
        
        # Clean up conversational prefixes
        prefixes_to_remove = [
            "here is the refined version:",
            "here are the refined notes:",
            "sure, here",
            "certainly,",
            "of course,",
            "here you go:",
        ]
        
        refined_lower = refined_notes.lower()
        for prefix in prefixes_to_remove:
            if refined_lower.startswith(prefix):
                idx = len(prefix)
                refined_notes = refined_notes[idx:].strip()
                break
        
        # Ensure it starts with a heading
        if not refined_notes.startswith('#'):
            refined_notes = f"# Refined Notes\n\n{refined_notes}"
        
        return refined_notes
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ AI Generation Error: {error_msg}")
        
        # Specific error messages
        if "401" in error_msg or "unauthorized" in error_msg.lower():
            return "🔑 **Authentication Error**: Invalid API key. Please check your OPENROUTER_API_KEY."
        elif "429" in error_msg or "rate limit" in error_msg.lower():
            return "⏱️ **Rate Limit**: Too many requests. Please wait and try again."
        elif "quota" in error_msg.lower() or "credits" in error_msg.lower():
            return "💳 **Quota Exceeded**: Your API credits may be exhausted. Check your OpenRouter account."
        elif "model" in error_msg.lower() or "not found" in error_msg.lower():
            return "🤖 **Model Error**: The AI model is unavailable. Please try again later."
        else:
            return f"❌ **Error**: Unable to generate notes.\n\n{error_msg[:200]}"