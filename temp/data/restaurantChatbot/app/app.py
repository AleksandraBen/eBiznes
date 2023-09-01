from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

openai.api_key = "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"

@app.route("/chatgpt", methods=["POST"])
def chatgpt():
    data = request.get_json()
    user_message = data["message"]

    
    response = openai.Completion.create(
        engine="davinci",  
        prompt=user_message,
        max_tokens=50, 
        n=1,  
        stop=None,
    )

    bot_reply = response.choices[0].text

    return jsonify({"bot_reply": bot_reply})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005, debug=True)
