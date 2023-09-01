# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

import requests
import json
import re

class CallGptAction(Action):
    def name(self):
        return "action_call_gpt"

    def run(self, dispatcher, tracker, domain):
        user_message = tracker.latest_message['text']
        url = "http://localhost:5005/chatgpt"
        headers = {"Content-Type": "application/json"}
        data = {"message": user_message}

        response = requests.post(url, headers=headers, json=data)

        if response.status_code == 200:
            bot_reply = response.json().get("bot_reply")
            dispatcher.utter_message(bot_reply)
        else:
            dispatcher.utter_message("Sorry, I couldn't generate a response at the moment.")

        return [SlotSet("gpt_response", bot_reply)]
