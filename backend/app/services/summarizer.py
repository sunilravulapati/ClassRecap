import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")

# Check if key exists to prevent the startup crash
if not api_key:
    raise ValueError("OPENROUTER_API_KEY is not set in the environment or .env file")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key,
)

def generate_summary(class_content: str):
    prompt = f"""
    You are an assistant helping a university instructor.
    Return ONLY valid JSON: {{ "topics": [], "key_takeaways": [], "recap_questions": [] }}
    Notes: {class_content}
    """

    try:
        response = client.chat.completions.create(
            model="google/gemini-2.0-flash-001",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            # This ensures the AI sends back a JSON-parsable string
            response_format={"type": "json_object"}, 
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print("OpenRouter Error:", e)
        return {
            "topics": ["Error loading summary"],
            "key_takeaways": [str(e)],
            "recap_questions": []
        }