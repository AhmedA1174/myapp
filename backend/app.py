from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from log_formatter import LogFormatter
import subprocess
import time
import uuid
import logging

logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

class AzurePolicyTester:
    def __init__(self, subscription_id, location="northeurope", max_retries=3):
        self.credential = DefaultAzureCredential()
        self.resource_client = ResourceManagementClient(self.credential, subscription_id)
        self.resource_group_name = f"testRG-{uuid.uuid4().hex[:8]}"
        self.location = location
        self.max_retries = max_retries
        self.log_formatter = LogFormatter()

    def _run_az_command(self, command, stage_name):
        command = command.replace("$RGTEST", self.resource_group_name)  # Ensure replacement of $RGTEST
        logging.debug(f"Executing command: {command}")
        result = subprocess.run(command, shell=True, text=True, capture_output=True)
        
        if result.returncode != 0:
            logging.error(f"Command failed with error: {result.stderr}")
            socketio.emit('log', {'stage': stage_name, 'message': f"Error: {result.stderr}"})
            raise Exception(f"Command failed: {result.stderr}")
        
        # Use the LogFormatter to format the output
        formatted_output = self.log_formatter.format_output(command, result.stdout)
        
        logging.debug(f"Command output: {formatted_output}")
        socketio.emit('log', {'stage': stage_name, 'message': f"Output: {formatted_output}"})  # Ensure you're using socketio.emit without broadcast argument
        
        return formatted_output


    def _create_resource_group(self):
        # CHANGED: Added a default stage name for the _run_az_command method
        self._run_az_command(f"az group create --name {self.resource_group_name} --location {self.location}", "Resource Group Creation")

    def _delete_resource_group(self):
        # CHANGED: Added a default stage name for the _run_az_command method
        self._run_az_command(f"az group delete --name {self.resource_group_name} --yes --no-wait", "Resource Group Deletion")

    def run_test(self, stages):
        self._create_resource_group()
        try:
            for stage in stages:
                stage_name = stage['name']
                stage_command = stage['command'].replace("$RGTEST", self.resource_group_name)
                retries = 0
                while retries < self.max_retries:
                    try:
                        self._run_az_command(stage_command, stage_name)  # Pass the stage name here
                        break
                    except Exception as e:
                        retries += 1
                        if retries == self.max_retries:
                            raise e
                        time.sleep(5)
        finally:
            self._delete_resource_group()

@app.route('/run-test', methods=['POST'])
def run_test_endpoint():
    stages_data = request.json.get('stages', [])
    stages = [{'name': s['name'], 'command': s['command']} for s in stages_data]
    subscription_id = request.json.get('subscriptionId', None)
    if not subscription_id:
        return jsonify({"status": "error", "message": "Subscription ID is required."})
    logging.info(f"Received stages: {stages}")
    tester = AzurePolicyTester(subscription_id)
    try:
        tester.run_test(stages)
        return jsonify({"status": "success", "message": "Test completed successfully!"})
    except Exception as e:
        logging.error(f"Test failed with error: {str(e)}")
        return jsonify({"status": "error", "message": str(e)})

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5002)
