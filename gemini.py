import google.generativeai as genai
from IPython.display import display, Markdown
import textwrap
import sys
import os
import pickle

# Configure the API key for Google Generative AI
GOOGLE_API_KEY = "AIzaSyC2BiDh-RaCXUe5XIZR67ZxMTrG3MYwujg"
genai.configure(api_key=GOOGLE_API_KEY)

# File to store chat history
HISTORY_FILE = 'chat_history.pkl'

# Load chat history from file
def load_chat_history():
    try:
        with open(HISTORY_FILE, 'rb') as f:
            return pickle.load(f)
    except FileNotFoundError:
        return []

# Save chat history to file
def save_chat_history(history):
    with open(HISTORY_FILE, 'wb') as f:
        pickle.dump(history, f)

# Select the most powerful model
generative_model = genai.GenerativeModel('gemini-2.0-flash')

# Function to generate a response using the generative model
def get_generative_response(prompt):
    # Load chat history
    history = load_chat_history()

    # Start a chat session with the loaded history
    chat = generative_model.start_chat(history=history)
    
    # Send the recognized text as a prompt
    response = chat.send_message(prompt)

    # Save updated chat history
    updated_history= chat.history
    save_chat_history(updated_history)

    return response.text

if __name__ == "__main__":
    # Force UTF-8 encoding for stdout and stderr
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

    input_text = sys.argv[1]
    file_path = sys.argv[2] if len(sys.argv) > 2 else None
    
    # Load chat history
    #history = load_chat_history()
    
    # Generate response and update chat history
    response_text = get_generative_response(input_text)
    
    # Save updated chat history
    #save_chat_history(updated_history)
    
    if file_path:
        file_name = os.path.basename(file_path)
        file_ext = file_name.split('.')[-1].lower()
        if file_ext in ['png', 'jpg', 'jpeg', 'gif']:
            response_text += f'<br><br><img src="file://{file_path}" style="max-width: 100px; max-height: 100px; margin-top: 10px;">'
        else:
            response_text += f'<br><br>File received: {file_name}'
    
    print(response_text)
