from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient
from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import time
import uuid
import logging

logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)
CORS(app)

class AzurePolicyTester:
    def __init__(self, subscription_id, location="northeurope", max_retries=3):
        self.credential = DefaultAzureCredential()
        self.resource_client = ResourceManagementClient(self.credential, subscription_id)
        self.resource_group_name = f"testRG-{uuid.uuid4().hex[:8]}"
        self.location = location
        self.max_retries = max_retries

    def _run_az_command(self, command):
        logging.debug(f"Executing command: {command}")
        result = subprocess.run(command, shell=True, text=True, capture_output=True)
        if result.returncode != 0:
            logging.error(f"Command failed with error: {result.stderr}")
            raise Exception(f"Command failed: {result.stderr}")
        logging.debug(f"Command output: {result.stdout}")
        return result.stdout

    def _create_resource_group(self):
        self._run_az_command(f"az group create --name {self.resource_group_name} --location {self.location}")

    def _delete_resource_group(self):
        self._run_az_command(f"az group delete --name {self.resource_group_name} --yes --no-wait")

    def run_test(self, stages):
        self._create_resource_group()
        try:
            for stage in stages:
                stage_with_rg = stage.replace("$RGTEST", self.resource_group_name)
                retries = 0
                while retries < self.max_retries:
                    try:
                        self._run_az_command(stage_with_rg)
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
    stages = request.json.get('stages', [])
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
    app.run(debug=True, port=5002)
