import os
import logging
from openai import OpenAI
from tenacity import retry, stop_after_attempt, wait_random_exponential

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

openai_client = OpenAI(api_key=OPENAI_API_KEY)

logger = logging.getLogger(__name__)

@retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(5))
def send_openai_request(prompt: str) -> str:
    try:
        logger.info(f"Sending request to OpenAI API with prompt: {prompt[:100]}...")
        completion = openai_client.chat.completions.create(
            model="gpt-4", messages=[{"role": "user", "content": prompt}], max_tokens=500
        )
        content = completion.choices[0].message.content
        if not content:
            logger.error("OpenAI returned an empty response.")
            raise ValueError("OpenAI returned an empty response.")
        logger.info(f"Received response from OpenAI API: {content[:100]}...")
        return content
    except Exception as e:
        logger.error(f"Error in OpenAI API call: {str(e)}")
        raise
